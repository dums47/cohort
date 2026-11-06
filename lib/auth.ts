import { createHash, randomUUID } from "node:crypto"
import { Pool } from "pg"
import { betterAuth } from "better-auth"

export const database = new Pool({ connectionString: process.env.DATABASE_URL })

const baseURL = process.env.BETTER_AUTH_URL|| https://shopmate-flax.vercel.app
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined)
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)
  ?? process.env.V0_RUNTIME_URL
  

const trustedOrigins = [
  "http://localhost:3000",
  ...[process.env.V0_RUNTIME_URL, process.env.V0_DEV_APP_URL, process.env.V0_BUILD_URL, process.env.V0_SANDBOX_URL]
    .filter((value): value is string => Boolean(value)),
  ...[process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.startsWith("http") ? value : `https://${value}`),
]

export type MerchantContext = {
  merchantId: string
  apiKeyId: string
  storeConfig: { primaryColor: string; widgetPosition: string; brandName: string }
}

export function extractApiKey(request: Request) {
  const bearer = request.headers.get("authorization")
  return bearer?.startsWith("Bearer ") ? bearer.slice(7).trim() : request.headers.get("x-api-key")?.trim()
}

export function hashApiKey(apiKey: string) {
  return createHash("sha256").update(apiKey).digest("hex")
}

export function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  if (!origin) return true
  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

export async function getOrCreateMerchant(email: string, name: string) {
  const id = `merchant_${randomUUID().replace(/-/g, "")}`
  const result = await database.query<{ id: string }>(
    `INSERT INTO "Merchant" (id, name, email, plan)
     VALUES ($1, $2, $3, 'starter')
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [id, name.trim() || email, email],
  )
  return result.rows[0].id
}

export async function requireMerchant(request: Request): Promise<MerchantContext> {
  const key = extractApiKey(request)
  if (!key || !key.startsWith("pk_live_")) throw new Response("Invalid API key", { status: 401 })

  const result = await database.query<{
    merchantId: string
    apiKeyId: string
    primaryColor: string | null
    widgetPosition: string | null
    brandName: string | null
  }>(
    `SELECT m.id AS "merchantId", k.id AS "apiKeyId",
            s."primaryColor", s."widgetPosition", s."brandName"
     FROM "ApiKey" k
     JOIN "Merchant" m ON m.id = k."merchantId"
     LEFT JOIN "StoreConfig" s ON s."merchantId" = m.id
     WHERE k."keyHash" = $1 AND k."isActive" = TRUE
     LIMIT 1`,
    [hashApiKey(key)],
  )
  const merchant = result.rows[0]
  if (!merchant) throw new Response("Invalid API key", { status: 401 })

  await database.query(`UPDATE "ApiKey" SET "lastUsedAt" = NOW() WHERE id = $1`, [merchant.apiKeyId])
  return {
    merchantId: merchant.merchantId,
    apiKeyId: merchant.apiKeyId,
    storeConfig: {
      primaryColor: merchant.primaryColor ?? "#6d5dfc",
      widgetPosition: merchant.widgetPosition ?? "bottom-right",
      brandName: merchant.brandName ?? "ShopMate",
    },
  }
}

export const auth = betterAuth({
  database,
  baseURL,
  trustedOrigins,
  emailAndPassword: { enabled: true },
  ...(process.env.NODE_ENV === "development" ? {
    advanced: {
      defaultCookieAttributes: { sameSite: "none" as const, secure: true },
    },
  } : {}),
})
