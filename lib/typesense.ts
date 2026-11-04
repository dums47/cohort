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

function getTypesenseConfig() {
  const host = process.env.TYPESENSE_HOST
  const apiKey = process.env.TYPESENSE_ADMIN_API_KEY
  if (!host || !apiKey) throw new Error("Typesense is not configured")

  const protocol = process.env.TYPESENSE_PROTOCOL ?? "http"
  const port = process.env.TYPESENSE_PORT ?? "8108"
  const baseUrl = host.startsWith("http://") || host.startsWith("https://")
    ? host.replace(/\/+$/, "")
    : `${protocol}://${host}${port ? `:${port}` : ""}`

  return { baseUrl, apiKey }
}

export function collectionNameForMerchant(merchantId: string) {
  return `catalog_${merchantId.replace(/[^a-zA-Z0-9_-]/g, "_")}`
}

export async function ensureMerchantCatalog(merchantId: string) {
  const { baseUrl, apiKey } = getTypesenseConfig()
  const collectionName = collectionNameForMerchant(merchantId)
  const headers = { "X-TYPESENSE-API-KEY": apiKey }
  const collectionUrl = `${baseUrl}/collections/${encodeURIComponent(collectionName)}`
  const existing = await fetch(collectionUrl, { headers })

  if (existing.ok) return collectionName
  if (existing.status !== 404) throw new Error(`Typesense collection lookup failed (${existing.status})`)

  const created = await fetch(`${baseUrl}/collections`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: collectionName,
      fields: [
        { name: "merchant_id", type: "string", facet: true },
        { name: "title", type: "string" },
        { name: "price", type: "float" },
        { name: "description", type: "string", optional: true },
        { name: "image_url", type: "string", optional: true },
        { name: "url", type: "string", optional: true },
        { name: "sku", type: "string", optional: true },
        { name: "stock", type: "int32", optional: true },
      ],
      default_sorting_field: "price",
    }),
  })

  if (!created.ok && created.status !== 409) {
    throw new Error(`Typesense collection creation failed (${created.status})`)
  }
  return collectionName
}

export async function importCatalogBatch(collectionName: string, documents: CatalogDocument[]) {
  const { baseUrl, apiKey } = getTypesenseConfig()
  const response = await fetch(
    `${baseUrl}/collections/${encodeURIComponent(collectionName)}/documents/import?action=upsert`,
    {
      method: "POST",
      headers: { "X-TYPESENSE-API-KEY": apiKey, "Content-Type": "text/plain" },
      body: documents.map((document) => JSON.stringify(document)).join("\n"),
    },
  )

  const result = await response.text()
  if (!response.ok) throw new Error(`Typesense document import failed (${response.status})`)

  const outcomes = result.split(/\r?\n/).filter(Boolean).map((line) => {
    try {
      return JSON.parse(line) as { success?: boolean }
    } catch {
      throw new Error("Typesense returned an invalid bulk import response")
    }
  })

  if (outcomes.length !== documents.length) throw new Error("Typesense returned an incomplete bulk import response")
  return {
    indexed: outcomes.filter((outcome) => outcome.success === true).length,
    failed: outcomes.filter((outcome) => outcome.success !== true).length,
  }
}

export async function searchMerchantCatalog(merchantId: string, query: string, limit: number) {
  const { baseUrl, apiKey } = getTypesenseConfig()
  const collectionName = collectionNameForMerchant(merchantId)
  const params = new URLSearchParams({
    q: query,
    query_by: "title,description,sku",
    filter_by: `merchant_id:=${merchantId}`,
    per_page: String(limit),
  })
  const response = await fetch(
    `${baseUrl}/collections/${encodeURIComponent(collectionName)}/documents/search?${params}`,
    { headers: { "X-TYPESENSE-API-KEY": apiKey } },
  )
  if (!response.ok) throw new Error(`Typesense catalog search failed (${response.status})`)

  const result = await response.json() as { hits?: Array<{ document?: Record<string, unknown> }> }
  return (result.hits ?? []).flatMap(({ document }) => {
    if (!document) return []
    return [{
      id: String(document.id ?? ""),
      name: String(document.title ?? ""),
      price: Number(document.price ?? 0),
      imageUrl: String(document.image_url ?? ""),
      url: String(document.url ?? ""),
      stock: Number(document.stock ?? 0),
    }]
  }).filter((product) => product.id && product.name)
}
