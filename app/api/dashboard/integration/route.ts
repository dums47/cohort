import { randomBytes, randomUUID } from "node:crypto"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth, database, getOrCreateMerchant, hasSameOrigin, hashApiKey } from "@/lib/auth"

async function getSessionMerchant() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.email) return null

  const merchantId = await getOrCreateMerchant(session.user.email, session.user.name ?? "")
  return { merchantId }
}

export async function GET() {
  try {
    const merchant = await getSessionMerchant()
    if (!merchant) return NextResponse.json({ error: "Sign in to continue" }, { status: 401 })

    const result = await database.query<{ publicKey: string }>(
      `SELECT "publicKey" FROM "ApiKey"
       WHERE "merchantId" = $1 AND "isActive" = TRUE AND "publicKey" IS NOT NULL
       ORDER BY "createdAt" DESC
       LIMIT 1`,
      [merchant.merchantId],
    )
    return NextResponse.json(
      { publishableKey: result.rows[0]?.publicKey ?? null },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    console.error("Could not load the merchant's integration key", error)
    return NextResponse.json({ error: "Could not load integration settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 })
  try {
    const merchant = await getSessionMerchant()
    if (!merchant) return NextResponse.json({ error: "Sign in to continue" }, { status: 401 })

    const key = `pk_live_${randomBytes(32).toString("base64url")}`
    await database.query(
      `INSERT INTO "ApiKey" (id, "merchantId", "keyHash", "publicKey", prefix, "isActive", "createdAt")
       VALUES ($1, $2, $3, $4, $5, TRUE, NOW())`,
      [`key_${randomUUID().replace(/-/g, "")}`, merchant.merchantId, hashApiKey(key), key, "pk_live_"],
    )
    return NextResponse.json({ publishableKey: key }, { status: 201, headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("Could not create a merchant integration key", error)
    return NextResponse.json({ error: "Could not create an integration key" }, { status: 500 })
  }
}
