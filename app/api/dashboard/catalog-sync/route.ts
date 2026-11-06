import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth, getOrCreateMerchant, hasSameOrigin } from "@/lib/auth"
import { syncCatalogProducts } from "@/lib/catalog-sync"
import { discoverCatalogProducts } from "@/scripts/sync-storefront-catalog.mjs"

export const runtime = "nodejs"
export const maxDuration = 300

const maxRequestBytes = 2 * 1024

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 })
  }
  if (Number(request.headers.get("content-length") ?? 0) > maxRequestBytes) {
    return NextResponse.json({ error: "Request is too large" }, { status: 413 })
  }

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in to sync your catalog" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 })
  }
  if (!body || typeof body !== "object" || !("storefrontUrl" in body) || typeof body.storefrontUrl !== "string") {
    return NextResponse.json({ error: "Provide a storefrontUrl" }, { status: 400 })
  }

  try {
    const { products, pagesScanned, pageErrors } = await discoverCatalogProducts(body.storefrontUrl)
    const merchantId = await getOrCreateMerchant(session.user.email, session.user.name ?? "")
    const result = await syncCatalogProducts(merchantId, products)
    return NextResponse.json({ ...result, pagesScanned, pageErrors }, { status: result.failed ? 207 : 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Catalog sync failed"
    const status = message.startsWith("Provide a public storefront URL") ? 400
      : message.startsWith("No storefront pages") || message.startsWith("No Product JSON-LD") ? 422
        : message === "Meilisearch is not configured" ? 503 : 502
    if (status >= 500) console.error("Storefront catalog sync failed", error)
    return NextResponse.json({ error: message }, { status })
  }
}
