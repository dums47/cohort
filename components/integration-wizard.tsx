"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, ChevronLeft, ChevronRight, Copy, X } from "lucide-react"

type CatalogSource = "upload" | "shopify" | "sync"
type MappedField = "title" | "price" | "description" | "image_url" | "sku" | "url" | "stock"
type UploadResult = { indexed: number; skipped: number; failed: number }

const mappings: Array<{ key: MappedField; label: string; required?: boolean; aliases: string[] }> = [
  { key: "title", label: "Title", required: true, aliases: ["title", "name", "product_name"] },
  { key: "price", label: "Price", required: true, aliases: ["price", "amount", "cost"] },
  { key: "description", label: "Description", aliases: ["description", "details"] },
  { key: "image_url", label: "Image URL", aliases: ["image_url", "imageurl", "image", "image_link"] },
  { key: "sku", label: "SKU", aliases: ["sku", "product_sku", "variant_sku"] },
  { key: "url", label: "Product URL", aliases: ["url", "product_url", "link"] },
  { key: "stock", label: "Stock", aliases: ["stock", "quantity", "inventory", "inventory_quantity"] },
]

function parseCsvHeaders(text: string) {
  const headers: string[] = []
  let value = ""
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        value += character
      }
    } else if (character === '"' && value.length === 0) {
      quoted = true
    } else if (character === ",") {
      headers.push(value.trim())
      value = ""
    } else if (character === "\n" || character === "\r") {
      break
    } else {
      value += character
    }
  }
  headers.push(value.trim().replace(/^\uFEFF/, ""))
  return headers.filter(Boolean)
}

function guessMapping(headers: string[]) {
  return Object.fromEntries(mappings.flatMap(({ key, aliases }) => {
    const match = headers.find((header) => aliases.includes(header.trim().toLowerCase().replace(/[\s-]+/g, "_")))
    return match ? [[key, match]] : []
  })) as Partial<Record<MappedField, string>>
}

export function IntegrationWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [source, setSource] = useState<CatalogSource | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [mapping, setMapping] = useState<Partial<Record<MappedField, string>>>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [shopifyUrl, setShopifyUrl] = useState("")
  const [shopifyMessage, setShopifyMessage] = useState("")
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [publishableKey, setPublishableKey] = useState<string | null>(null)
  const [keyLoading, setKeyLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const embed = useMemo(() => publishableKey
    ? `<script src="https://api.shopmate.ai/widget.js" data-api-key="${publishableKey}"></script>`
    : "", [publishableKey])

  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    setKeyLoading(true)
    setError("")
    fetch("/api/dashboard/integration", { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as { publishableKey?: string | null; error?: string }
        if (!response.ok) throw new Error(result.error ?? "Could not load the active API key")
        setPublishableKey(result.publishableKey ?? null)
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === "AbortError") return
        setError(cause instanceof Error ? cause.message : "Could not load integration settings")
      })
      .finally(() => setKeyLoading(false))
    return () => controller.abort()
  }, [open])

  if (!open) return null

  async function selectFile(selected: File | null) {
    setFile(selected)
    setUploadResult(null)
    setError("")
    if (!selected) {
      setHeaders([])
      setMapping({})
      return
    }
    if (selected.size > 8 * 1024 * 1024) {
      setFile(null)
      setError("Catalog files must be 8 MB or smaller")
      return
    }

    try {
      const content = await selected.text()
      let columns: string[]
      if (selected.name.toLowerCase().endsWith(".json")) {
        const value: unknown = JSON.parse(content)
        const entries = Array.isArray(value)
          ? value
          : value && typeof value === "object" && Array.isArray((value as { products?: unknown }).products)
            ? (value as { products: unknown[] }).products
            : []
        const first = entries[0]
        if (!first || typeof first !== "object" || Array.isArray(first)) throw new Error("JSON must contain product objects")
        columns = Object.keys(first)
      } else if (selected.name.toLowerCase().endsWith(".csv")) {
        columns = parseCsvHeaders(content)
      } else {
        throw new Error("Choose a .csv or .json file")
      }
      if (columns.length === 0) throw new Error("No columns were found in this file")
      setHeaders(columns)
      setMapping(guessMapping(columns))
    } catch (cause) {
      setFile(null)
      setHeaders([])
      setMapping({})
      setError(cause instanceof Error ? cause.message : "Could not read the selected file")
    }
  }

  async function uploadCatalog() {
    if (!file || !mapping.title || !mapping.price) {
      setError("Choose a file and map both Title and Price.")
      return
    }
    setBusy(true)
    setError("")
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("mapping", JSON.stringify(mapping))
      const response = await fetch("/api/v1/catalog/upload", { method: "POST", body: form })
      const result = await response.json() as UploadResult & { error?: string }
      if (!response.ok && response.status !== 207) throw new Error(result.error ?? "Catalog upload failed")
      setUploadResult(result)
      if (result.indexed > 0) setStep(2)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Catalog upload failed")
    } finally {
      setBusy(false)
    }
  }

  async function createKey() {
    setBusy(true)
    setError("")
    try {
      const response = await fetch("/api/dashboard/integration", { method: "POST" })
      const result = await response.json() as { publishableKey?: string; error?: string }
      if (!response.ok || !result.publishableKey) throw new Error(result.error ?? "Could not create an API key")
      setPublishableKey(result.publishableKey)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create an API key")
    } finally {
      setBusy(false)
    }
  }

  async function copyEmbed() {
    if (!embed) return
    setError("")
    try {
      await navigator.clipboard.writeText(embed)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setError("Could not access the clipboard. Select and copy the code manually.")
    }
  }

  function continueToEmbed() {
    setError("")
    setStep(2)
  }

  const syncUrl = "/api/v1/products/sync"

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="integration-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
      <header className="flex items-start justify-between gap-4">
        <div><p className="text-sm font-medium text-primary">Store setup</p><h2 id="integration-title" className="mt-1 text-xl font-semibold">Store Setup &amp; Catalog Sync</h2></div>
        <button onClick={onClose} aria-label="Close integration setup" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="size-4" /></button>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
        <div className={`rounded-lg px-3 py-2 ${step === 1 ? "bg-primary/10 font-medium text-primary" : "bg-muted text-muted-foreground"}`}>1. Catalog data</div>
        <div className={`rounded-lg px-3 py-2 ${step === 2 ? "bg-primary/10 font-medium text-primary" : "bg-muted text-muted-foreground"}`}>2. Widget embed</div>
      </div>

      {step === 1 ? <div className="mt-5">
        <h3 className="font-semibold">How would you like to connect your catalog?</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {([
            ["upload", "Upload Catalog", "CSV or JSON"],
            ["shopify", "Shopify / App", "Connect a store"],
            ["sync", "Data Sync API", "Push products over HTTP"],
          ] as const).map(([id, title, detail]) => <button key={id} onClick={() => { setSource(id); setError("") }} aria-pressed={source === id} className={`rounded-xl border p-3 text-left transition-colors ${source === id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}><span className="block text-sm font-semibold">{title}</span><span className="mt-1 block text-xs text-muted-foreground">{detail}</span></button>)}
        </div>

        {source === "upload" && <div className="mt-5 rounded-xl border border-border p-4">
          <label className="flex flex-col gap-2 text-sm font-medium">Catalog file<input type="file" accept=".csv,.json,application/json,text/csv" onChange={(event) => void selectFile(event.target.files?.[0] ?? null)} className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary" /></label>
          {headers.length > 0 && <div className="mt-4"><p className="text-sm font-semibold">Map your catalog columns</p><p className="mt-1 text-xs text-muted-foreground">Title and Price are required. Other fields are optional.</p><div className="mt-3 grid gap-3 sm:grid-cols-2">
            {mappings.map(({ key, label, required }) => <label key={key} className="flex flex-col gap-1.5 text-sm">{label}{required && <span className="sr-only"> required</span>}<select value={mapping[key] ?? ""} onChange={(event) => setMapping((current) => ({ ...current, [key]: event.target.value || undefined }))} className="rounded-lg border border-input bg-background px-3 py-2 text-sm"><option value="">Not mapped{required ? " (required)" : ""}</option>{headers.map((header) => <option key={header} value={header}>{header}</option>)}</select></label>)}
          </div></div>}
          {uploadResult && <p role="status" className="mt-3 text-sm text-muted-foreground">Indexed {uploadResult.indexed}; skipped {uploadResult.skipped}; failed {uploadResult.failed}.</p>}
          {file && <button onClick={() => void uploadCatalog()} disabled={busy || !mapping.title || !mapping.price} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{busy ? "Uploading and indexing..." : "Upload and index catalog"}</button>}
        </div>}

        {source === "shopify" && <form className="mt-5 rounded-xl border border-border p-4" onSubmit={(event) => { event.preventDefault(); setShopifyMessage("Shopify OAuth is not configured yet. You can continue and add the widget after setup.") }}>
          <label className="flex flex-col gap-2 text-sm font-medium">Store URL<input type="url" required placeholder="https://your-store.myshopify.com" value={shopifyUrl} onChange={(event) => setShopifyUrl(event.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" /></label>
          <button className="mt-3 rounded-xl border border-input px-4 py-2 text-sm font-medium">Connect store</button>
          {shopifyMessage && <p role="status" className="mt-3 text-sm text-muted-foreground">{shopifyMessage}</p>}
          <p className="mt-3 text-xs text-muted-foreground">Store URL and OAuth fields are ready for the app connection flow; OAuth is not yet enabled.</p>
        </form>}

        {source === "sync" && <div className="mt-5 rounded-xl border border-border p-4">
          <p className="text-sm font-medium">Send product batches to this endpoint:</p>
          <code className="mt-2 block break-all rounded-lg bg-muted p-3 text-xs">{syncUrl}</code>
          <p className="mt-3 text-xs text-muted-foreground">POST JSON with an <code>Authorization: Bearer YOUR_PUBLISHABLE_API_KEY</code> header. Each product needs a title and price.</p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs">{`{\n  "products": [\n    { "title": "Sample product", "price": 19.99, "sku": "SKU-001" }\n  ]\n}`}</pre>
        </div>}

        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
        <footer className="mt-5 flex flex-wrap justify-between gap-3">
          <button onClick={onClose} className="rounded-xl border border-input px-4 py-2 text-sm font-medium">Cancel</button>
          <div className="flex gap-2">
            <button onClick={continueToEmbed} className="rounded-xl border border-input px-4 py-2 text-sm font-medium">Skip catalog</button>
            {source && source !== "upload" && <button onClick={continueToEmbed} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Continue <ChevronRight className="size-4" /></button>}
          </div>
        </footer>
      </div> : <div className="mt-5">
        <h3 className="font-semibold">Add the Shopmate widget to your storefront</h3>
        <p className="mt-2 text-sm text-muted-foreground">Place this script before the closing <code className="font-mono text-foreground">&lt;/body&gt;</code> tag. This embed uses your active publishable key from the database.</p>
        {keyLoading ? <p className="mt-4 text-sm text-muted-foreground">Loading your active API key...</p>
          : publishableKey ? <div className="mt-4 flex items-start gap-3 rounded-xl bg-muted p-4"><code className="min-w-0 flex-1 break-all font-mono text-xs">{embed}</code><button onClick={() => void copyEmbed()} aria-label="Copy widget embed code" className="shrink-0 rounded-lg bg-primary p-2 text-primary-foreground">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</button></div>
            : <div className="mt-4 rounded-xl border border-border p-4"><p className="text-sm text-muted-foreground">No retrievable active publishable key was found. Older keys are stored as hashes and cannot be recovered; create a new key for this embed.</p><button disabled={busy} onClick={() => void createKey()} className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{busy ? "Creating key..." : "Create publishable key"}</button></div>}
        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
        <footer className="mt-5 flex justify-between gap-3"><button onClick={() => setStep(1)} className="inline-flex items-center gap-2 rounded-xl border border-input px-4 py-2 text-sm font-medium"><ChevronLeft className="size-4" /> Back</button><button onClick={onClose} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Finish</button></footer>
      </div>}
    </section>
  </div>
}
