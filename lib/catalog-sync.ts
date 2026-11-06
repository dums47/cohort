import { createHash } from "node:crypto"
import { CatalogDocument, ensureMerchantCatalog, importCatalogBatch } from "@/lib/meilisearch"

const batchSize = 500
const maxProducts = 10_000

function asText(value: unknown) {
  return value === undefined || value === null ? "" : String(value).trim()
}

export async function syncCatalogProducts(merchantId: string, products: unknown[]) {
  if (products.length === 0 || products.length > maxProducts) {
    throw new Error(`Provide between 1 and ${maxProducts.toLocaleString()} products`)
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
      id: createHash("sha256").update(`${merchantId}\n${identity}`).digest("hex").slice(0, 32),
      merchant_id: merchantId,
      title,
      price,
      description: asText(item.description),
      ...(imageUrl ? { image_url: imageUrl } : {}),
      ...(url ? { url } : {}),
      ...(sku ? { sku } : {}),
      stock,
    })
  }

  if (documents.length === 0) throw new Error("No valid products found")

  const collection = await ensureMerchantCatalog(merchantId)
  let indexed = 0
  let failed = 0
  for (let offset = 0; offset < documents.length; offset += batchSize) {
    const result = await importCatalogBatch(collection, documents.slice(offset, offset + batchSize))
    indexed += result.indexed
    failed += result.failed
  }

  return { collection, indexed, failed, skipped, total: products.length }
}
