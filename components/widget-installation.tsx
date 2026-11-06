"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { Check, Copy, ExternalLink, LoaderCircle, Sparkles } from "lucide-react"

const widgetScriptUrl = "https://api.shopmate.ai/widget.js"
const verificationTimeoutMs = 15000

type VerificationStatus = "checking" | "verified" | "not-found"

function isWidgetReadyMessage(value: unknown): value is { type: "shopmate:widget-ready"; apiKey: string } {
  if (!value || typeof value !== "object") return false
  const message = value as { type?: unknown; apiKey?: unknown }
  return message.type === "shopmate:widget-ready" && typeof message.apiKey === "string"
}

export function WidgetInstallation() {
  const [publishableKey, setPublishableKey] = useState<string | null>(null)
  const [keyLoading, setKeyLoading] = useState(true)
  const [creatingKey, setCreatingKey] = useState(false)
  const [syncingCatalog, setSyncingCatalog] = useState(false)
  const [domain, setDomain] = useState("")
  const [syncMessage, setSyncMessage] = useState("")
  const [frameUrl, setFrameUrl] = useState("")
  const [attempt, setAttempt] = useState(0)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timeoutRef = useRef<number | null>(null)
  const expectedOriginRef = useRef<string | null>(null)
  const expectedKeyRef = useRef<string | null>(null)
  expectedKeyRef.current = publishableKey

  const embed = publishableKey
    ? `<script src="${widgetScriptUrl}" data-api-key="${publishableKey}"></script>`
    : ""

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/dashboard/integration", { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as { publishableKey?: string | null; error?: string }
        if (!response.ok) throw new Error(result.error ?? "Could not load the active publishable key")
        setPublishableKey(result.publishableKey ?? null)
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === "AbortError") return
        setError(cause instanceof Error ? cause.message : "Could not load integration settings")
      })
      .finally(() => setKeyLoading(false))
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const handleMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== expectedOriginRef.current || event.source !== iframeRef.current?.contentWindow) return
      if (!isWidgetReadyMessage(event.data) || event.data.apiKey !== expectedKeyRef.current) return
      window.clearTimeout(timeoutRef.current ?? undefined)
      timeoutRef.current = null
      setVerificationStatus("verified")
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  useEffect(() => () => {
    window.clearTimeout(timeoutRef.current ?? undefined)
  }, [])

  async function createKey() {
    setCreatingKey(true)
    setError("")
    try {
      const response = await fetch("/api/dashboard/integration", { method: "POST" })
      const result = await response.json() as { publishableKey?: string; error?: string }
      if (!response.ok || !result.publishableKey) throw new Error(result.error ?? "Could not create a publishable key")
      setPublishableKey(result.publishableKey)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create a publishable key")
    } finally {
      setCreatingKey(false)
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

  async function syncCatalog() {
    setError("")
    setSyncMessage("")
    setSyncingCatalog(true)
    try {
      const response = await fetch("/api/dashboard/catalog-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storefrontUrl: domain }),
      })
      const result = await response.json() as {
        error?: string
        indexed?: number
        total?: number
        pagesScanned?: number
        pageErrors?: number
        skipped?: number
      }
      if (!response.ok) throw new Error(result.error ?? "Catalog sync failed")
      const details = [
        `Synced ${result.indexed ?? 0} products from ${result.pagesScanned ?? 0} pages.`,
        result.skipped ? `${result.skipped} products were skipped.` : "",
        result.pageErrors ? `${result.pageErrors} pages could not be read.` : "",
      ].filter(Boolean)
      setSyncMessage(details.join(" "))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sync the storefront catalog")
    } finally {
      setSyncingCatalog(false)
    }
  }

  function verifyInstallation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setVerificationStatus(null)

    let url: URL
    try {
      url = new URL(domain)
    } catch {
      setError("Enter a complete storefront URL, such as https://store.example.com")
      return
    }

    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
      setError("Use a storefront URL that starts with https:// or http:// and has no sign-in details.")
      return
    }
    if (!publishableKey) {
      setError("Create a publishable key before verifying your installation.")
      return
    }

    window.clearTimeout(timeoutRef.current ?? undefined)
    expectedOriginRef.current = url.origin
    setVerificationStatus("checking")
    setFrameUrl(url.href)
    setAttempt((current) => current + 1)
    timeoutRef.current = window.setTimeout(() => {
      setVerificationStatus((current) => current === "checking" ? "not-found" : current)
    }, verificationTimeoutMs)
  }

  return <div className="rounded-2xl border border-border bg-card p-5">
    <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-primary" /> Embed AI Search Widget</div>
    <p className="mt-2 text-sm text-muted-foreground">Copy this script into your site before the closing <code className="font-mono text-foreground">&lt;/body&gt;</code> tag, then sync the catalog below. The widget searches products after they have been imported.</p>

    {keyLoading ? <p className="mt-5 text-sm text-muted-foreground">Loading your publishable key...</p>
      : publishableKey ? <div className="mt-5 flex items-start gap-3 rounded-xl bg-muted p-4">
        <code className="min-w-0 flex-1 break-all font-mono text-xs">{embed}</code>
        <button type="button" onClick={() => void copyEmbed()} aria-label={copied ? "Embed code copied" : "Copy widget embed code"} className="shrink-0 rounded-lg bg-primary p-2 text-primary-foreground">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
        : <div className="mt-5 rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Create a publishable key to generate your personalized widget script.</p>
          <button type="button" disabled={creatingKey} onClick={() => void createKey()} className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{creatingKey ? "Creating key..." : "Create publishable key"}</button>
        </div>}

    <div className="mt-6 border-t border-border pt-5">
      <h3 className="font-semibold">Verify it on your site</h3>
      <p className="mt-1 text-sm text-muted-foreground">Enter your storefront URL. We’ll check that this page loads the widget with your publishable key.</p>
      <form onSubmit={verifyInstallation} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="storefront-url">Storefront URL</label>
        <input id="storefront-url" type="url" required placeholder="https://store.example.com" value={domain} onChange={(event) => setDomain(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
        <button type="submit" disabled={!publishableKey || verificationStatus === "checking"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
          {verificationStatus === "checking" ? <LoaderCircle className="size-4 animate-spin" /> : <ExternalLink className="size-4" />}
          {verificationStatus === "checking" ? "Checking..." : "Verify installation"}
        </button>
      </form>

      {verificationStatus === "verified" && <p role="status" className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400"><Check className="size-4" />Widget detected on your storefront.</p>}
      {verificationStatus === "not-found" && <p role="status" className="mt-3 text-sm text-muted-foreground">We couldn’t confirm the widget. Check that the script is installed with this key and try again. Your site may block embedded previews.</p>}
      {verificationStatus === "checking" && <p role="status" className="mt-3 text-sm text-muted-foreground">Loading your storefront and waiting for the widget...</p>}
      {frameUrl && <iframe key={attempt} ref={iframeRef} src={frameUrl} title="Storefront installation check" sandbox="allow-scripts allow-same-origin" referrerPolicy="strict-origin" tabIndex={-1} aria-hidden="true" className="pointer-events-none absolute size-px border-0 opacity-0" />}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button type="button" onClick={() => void syncCatalog()} disabled={!domain || syncingCatalog} className="inline-flex items-center justify-center gap-2 rounded-xl border border-input px-4 py-2.5 text-sm font-medium disabled:opacity-50">
          {syncingCatalog && <LoaderCircle className="size-4 animate-spin" />}
          {syncingCatalog ? "Syncing catalog..." : "Sync catalog"}
        </button>
        <p className="text-xs text-muted-foreground">Requires a public HTTPS store with a sitemap and Product JSON-LD.</p>
      </div>
      {syncMessage && <p role="status" className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{syncMessage}</p>}
    </div>

    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
  </div>
}
