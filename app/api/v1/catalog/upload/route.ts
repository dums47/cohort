import { createHash } from "node:crypto"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth, getOrCreateMerchant, hasSameOrigin } from "@/lib/auth"
// 1. Swap Typesense for Meilisearch helper functions
import { CatalogDocument, ensureMerchantCatalog, importCatalogBatch } from "@/lib/meilisearch"

export const runtime = "nodejs"

type ColumnMapping = Partial<Record<"title" | "price" | "description" | "image_url" | "url" | "sku" | "stock", string>>
type SourceRow = Record<string, unknown>

const maxFileSize = 8 * 1024 * 1024
const maxRows = 10_000
const batchSize = 500

function parseCsv(content: string): SourceRow[] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let quoted = false

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index]
    if (quoted) {
      if (character === '"' && content[index + 1] === '"') {
        field += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        field += character
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true
    } else if (character === ",") {
      row.push(field)
      field = ""
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && content[index + 1] === "\n") index += 1
      row.push(field)
      if (row.some((cell) => cell.length > 0)) rows.push(row)
      row = []
      field = ""
    } else {
      field += character
    }
  }

  if (quoted) throw new Error("CSV contains an unclosed quoted field")
  row.push(field)
  if (row.some((cell) => cell.length > 0)) rows.push(row)
  if (rows.length < 2) throw new Error("CSV must include a header and at least one product")

  const headers = rows[0].map((header) => header.trim().replace(/^\uFEFF/, ""))
  if (headers.some((header) => !header)) throw new Error("CSV headers cannot be empty")
  return rows.slice(1).map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])))
}

function parseRows(content: string, filename: string): SourceRow[] {
  if (filename.toLowerCase().endsWith(".csv")) return parseCsv(content)
  if (!filename.toLowerCase().endsWith(".json")) throw new Error("Upload a .csv or .json catalog file")

  const parsed: unknown = JSON.parse(content)
  const rows = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object" && Array.isArray((parsed as { products?: unknown }).products)
      ? (parsed as { products: unknown[] }).products
      : null
  if (!rows || rows.length === 0 || !rows.every((row) => row !== null && typeof row === "object" && !Array.isArray(row))) {
    throw new Error("JSON must contain an array of product objects or a products array")
  }
  return rows as SourceRow[]
}

function getValue(row: SourceRow, source: string | undefined) {
  if (!source) return ""
  const value = row[source]
  return value === undefined || value === null ? "" : String(value).trim()
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 })
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.email) return NextResponse.json({ error: "Sign in to upload a catalog" }, { status: 401 })

  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > maxFileSize + 64 * 1024) {
    return NextResponse.json({ error: "Catalog files must be 8 MB or smaller" }, { status: 413 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: "Upload must use multipart form data" }, { status: 400 })
  }
  const file = form.get("file")
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a catalog file to upload" }, { status: 400 })
  if (file.size === 0 || file.size > maxFileSize) {
    return NextResponse.json({ error: "Catalog files must be between 1 byte and 8 MB" }, { status: 413 })
  }

  let mapping: ColumnMapping
  let rows: SourceRow[]
  try {
    const mappingValue = form.get("mapping")
    if (typeof mappingValue !== "string") throw new Error("Select the columns to map before uploading")
    mapping = JSON.parse(mappingValue) as ColumnMapping
    if (!mapping.title || !mapping.price) throw new Error("Map both Title and Price to continue")
    rows = parseRows(await file.text(), file.name)
    if (rows.length > maxRows) throw new Error(`Catalogs may contain at most ${maxRows.toLocaleString()} products`)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid catalog file" }, { status: 400 })
  }

  const merchantId = await getOrCreateMerchant(session.user.email, session.user.name ?? "")
  const documents: CatalogDocument[] = []
  let skipped = 0

  for (const row of rows) {
    const title = getValue(row, mapping.title)
    const priceValue = getValue(row, mapping.price)
    const price = Number(priceValue)
    if (!title || !priceValue || !Number.isFinite(price) || price < 0) {
      skipped += 1
      continue
    }

    const sku = getValue(row, mapping.sku)
    const imageUrl = getValue(row, mapping.image_url)
    const stockValue = getValue(row, mapping.stock)
    const stock = stockValue ? Number(stockValue) : 0
    if (stockValue && (!Number.isInteger(stock) || stock < 0)) {
      skipped += 1
      continue
    }

    const identity = sku || `${title}\n${price}\n${imageUrl}`
    const id = createHash("sha256").update(`${merchantId}\n${identity}`).digest("hex").slice(0, 32)
    documents.push({
      id,
      merchant_id: merchantId,
      title,
      price,
      description: getValue(row, mapping.description),
      ...(imageUrl ? { image_url: imageUrl } : {}),
      ...(getValue(row, mapping.url) ? { url: getValue(row, mapping.url) } : {}),
      ...(sku ? { sku } : {}),
      stock,
    })
  }

  if (documents.length === 0) {
    return NextResponse.json({ error: "No valid products found. Check the mapped Title and Price values." }, { status: 400 })
  }

  try {
    const collection = await ensureMerchantCatalog(merchantId)
    let indexed = 0
    let failed = 0
    for (let offset = 0; offset < documents.length; offset += batchSize) {
      const result = await importCatalogBatch(collection, documents.slice(offset, offset + batchSize))
      indexed += result.indexed
      failed += result.failed
    }
    return NextResponse.json(
      { collection, indexed, failed, skipped, total: rows.length },
      { status: failed ? 207 : 200 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Catalog import failed"
    console.error("Meilisearch catalog upload failed", error)
    const status = message === "Meilisearch is not configured" ? 503 : 502
    return NextResponse.json({ error: message }, { status })
  }
}