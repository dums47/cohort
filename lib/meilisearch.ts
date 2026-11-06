export type CatalogDocument = {
  id: string
  merchant_id: string
  title: string
  price: number
  description: string
  image_url?: string
  url?: string
  sku?: string
  stock: number
}

function getMeilisearchConfig() {
  const host = process.env.MEILISEARCH_HOST
  const apiKey = process.env.MEILISEARCH_MASTER_KEY || process.env.MEILISEARCH_API_KEY
  if (!host || !apiKey) throw new Error("Meilisearch is not configured")

  const baseUrl = host.startsWith("http://") || host.startsWith("https://")
    ? host.replace(/\/+$/, "")
    : `https://${host}`

  return { baseUrl, apiKey }
}

export function collectionNameForMerchant(merchantId: string) {
  return `catalog_${merchantId.replace(/[^a-zA-Z0-9_-]/g, "_")}`
}

export async function ensureMerchantCatalog(merchantId: string) {
  const { baseUrl, apiKey } = getMeilisearchConfig()
  const indexName = collectionNameForMerchant(merchantId)
  const headers = { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }

  // Check if index exists
  const existing = await fetch(`${baseUrl}/indexes/${encodeURIComponent(indexName)}`, { headers })
  if (existing.ok) return indexName

  if (existing.status !== 404) {
    throw new Error(`Meilisearch index lookup failed (${existing.status})`)
  }

  // Create index if it doesn't exist
  const created = await fetch(`${baseUrl}/indexes`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      uid: indexName,
      primaryKey: "id",
    }),
  })

  if (!created.ok && created.status !== 409) {
    throw new Error(`Meilisearch index creation failed (${created.status})`)
  }

  // Configure filterable attributes for merchant filtering
  await fetch(`${baseUrl}/indexes/${encodeURIComponent(indexName)}/filterable-attributes`, {
    method: "PUT",
    headers,
    body: JSON.stringify(["merchant_id"]),
  })

  return indexName
}

export async function importCatalogBatch(indexName: string, documents: CatalogDocument[]) {
  const { baseUrl, apiKey } = getMeilisearchConfig()
  const response = await fetch(
    `${baseUrl}/indexes/${encodeURIComponent(indexName)}/documents?primaryKey=id`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documents),
    },
  )

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Meilisearch document import failed (${response.status}): ${errorBody}`)
  }

  // Meilisearch returns a task object asynchronously
  return {
    indexed: documents.length,
    failed: 0,
  }
}

export async function searchMerchantCatalog(merchantId: string, query: string, limit: number) {
  const { baseUrl, apiKey } = getMeilisearchConfig()
  const indexName = collectionNameForMerchant(merchantId)

  const response = await fetch(
    `${baseUrl}/indexes/${encodeURIComponent(indexName)}/search`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        filter: `merchant_id = "${merchantId}"`,
        limit: limit,
      }),
    },
  )

  if (!response.ok) {
    // If index doesn't exist yet, return empty list gracefully instead of crashing
    if (response.status === 404) return []
    throw new Error(`Meilisearch catalog search failed (${response.status})`)
  }

  const result = await response.json() as { hits?: Array<Record<string, unknown>> }
  return (result.hits ?? []).map((document) => ({
    id: String(document.id ?? ""),
    name: String(document.title ?? ""),
    price: Number(document.price ?? 0),
    imageUrl: String(document.image_url ?? ""),
    url: String(document.url ?? ""),
    stock: Number(document.stock ?? 0),
  })).filter((product) => product.id && product.name)
}