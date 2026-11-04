"use client"

import { useEffect, useState } from "react"
import { KeyRound, Plus, ShieldCheck } from "lucide-react"

export default function KeysPage() {
  const [publishableKey, setPublishableKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/dashboard/integration", { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as { publishableKey?: string | null; error?: string }
        if (!response.ok) throw new Error(result.error ?? "Could not load API keys")
        setPublishableKey(result.publishableKey ?? null)
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === "AbortError") return
        setError(cause instanceof Error ? cause.message : "Could not load API keys")
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  async function createKey() {
    setCreating(true)
    setError("")
    try {
      const response = await fetch("/api/dashboard/integration", { method: "POST" })
      const result = await response.json() as { publishableKey?: string; error?: string }
      if (!response.ok || !result.publishableKey) throw new Error(result.error ?? "Could not create an API key")
      setPublishableKey(result.publishableKey)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create an API key")
    } finally {
      setCreating(false)
    }
  }

  const maskedKey = publishableKey ? `pk_live_••••••••••••${publishableKey.slice(-4)}` : null

  return <section className="p-6 md:p-10">
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Merchant portal</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">API keys</h1>
          <p className="mt-2 text-muted-foreground">Manage the publishable key used by your storefront integration.</p>
        </div>
        <button onClick={() => void createKey()} disabled={creating} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
          <Plus className="size-4" />{creating ? "Generating..." : "Generate key"}
        </button>
      </div>
      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <KeyRound className="size-5 text-primary" />
          <div>
            <p className="font-medium">Publishable key</p>
            <p className="font-mono text-sm text-muted-foreground">{loading ? "Loading..." : maskedKey ?? "No active publishable key"}</p>
          </div>
          {publishableKey && <span className="ml-auto rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">Active</span>}
        </div>
        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" />The widget embed wizard retrieves the active key for you.</div>
        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      </div>
    </div>
  </section>
}
