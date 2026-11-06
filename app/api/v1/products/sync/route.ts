import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { requireMerchant } from "@/lib/auth"
import { CatalogDocument, ensureMerchantCatalog, importCatalogBatch } from "@/lib/meilisearch"

export const runtime = "nodejs"

const batchSize = 500
const maxProducts = 10_000

function asText(value: unknown) {
  return value === undefined || value === null ? "" : String(value).trim()
}

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
  if (!products || products.length === 0 || products.length > maxProducts) {
    return NextResponse.json({ error: `Provide between 1 and ${maxProducts.toLocaleString()} products` }, { status: 400 })
  }

  const documents: CatalogDocument[] = []
  let skipped = 0
  for (const product of products) {
    if (!product || typeof product !== "object" || Array.isArray(product)) {
      skipped += 1
      continue
    }

    const item = product as Record<string, unknown>
    const title = asText(item.title ?? item.name)
    const priceValue = item.price
    const price = typeof priceValue === "number" ? priceValue : Number(asText(priceValue))
    const stockValue = item.stock
    const stock = stockValue === undefined || stockValue === null || stockValue === ""
      ? 0
      : typeof stockValue === "number" ? stockValue : Number(asText(stockValue))
    if (!title || priceValue === undefined || priceValue === null || asText(priceValue) === "" || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      skipped += 1
      continue
    }

    const sku = asText(item.sku)
    const imageUrl = asText(item.imageUrl ?? item.image_url)
    const url = asText(item.url)
    const identity = sku || `${title}\n${price}\n${imageUrl}`
    documents.push({
      id: createHash("sha256").update(`${merchant.merchantId}\n${identity}`).digest("hex").slice(0, 32),
      merchant_id: merchant.merchantId,
      title,
      price,
      description: asText(item.description),
      ...(imageUrl ? { image_url: imageUrl } : {}),
      ...(url ? { url } : {}),
      ...(sku ? { sku } : {}),
      stock,
    })
  }

  if (documents.length === 0) {
    return NextResponse.json({ error: "No valid products found" }, { status: 400 })
  }

  try {
    const collection = await ensureMerchantCatalog(merchant.merchantId)
    let indexed = 0
    let failed = 0
    for (let offset = 0; offset < documents.length; offset += batchSize) {
      const result = await importCatalogBatch(collection, documents.slice(offset, offset + batchSize))
      indexed += result.indexed
      failed += result.failed
    }
    return NextResponse.json({ collection, indexed, failed, skipped, total: products.length }, { status: failed ? 207 : 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Product sync failed"
    console.error("Meilisearch product sync failed", error)
    return NextResponse.json({ error: message }, { status: message === "Meilisearch is not configured" ? 503 : 502 })
  }
}
