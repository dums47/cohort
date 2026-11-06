import { NextResponse } from "next/server"
import { requireMerchant } from "@/lib/auth"
import { syncCatalogProducts } from "@/lib/catalog-sync"

export const runtime = "nodejs"

export async function POST(request: Request) {
  let merchant: Awaited<ReturnType<typeof requireMerchant>>
  try {
    merchant = await requireMerchant(request)
  } catch (error) {
    if (error instanceof Response) return error
    throw error
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Sync requests must be 8 MB or smaller" }, { status: 413 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 })
  }
  const products = Array.isArray(body)
    ? body
    : body && typeof body === "object" && Array.isArray((body as { products?: unknown }).products)
      ? (body as { products: unknown[] }).products
      : null
  if (!products) {
    return NextResponse.json({ error: "Provide products as an array or in a products array" }, { status: 400 })
  }

  try {
    const result = await syncCatalogProducts(merchant.merchantId, products)
    return NextResponse.json(result, { status: result.failed ? 207 : 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Product sync failed"
    console.error("Meilisearch product sync failed", error)
    const status = message === "Meilisearch is not configured" ? 503
      : message === "No valid products found" || message.startsWith("Provide between ") ? 400 : 502
    return NextResponse.json({ error: message }, { status })
  }
}
