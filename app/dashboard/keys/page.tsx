"use client"

import { useEffect, useState } from "react"
import { KeyRound, Plus, ShieldCheck, Copy, Check } from "lucide-react"

export default function KeysPage() {
  const [publishableKey, setPublishableKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

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

  const copyToClipboard = () => {
    if (!publishableKey) return
    navigator.clipboard.writeText(publishableKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const maskedKey = publishableKey ? `pk_live_••••••••••••${publishableKey.slice(-4)}` : null

  return (
    <section className="p-6 md:p-10 transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#159478]">
              Merchant portal
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              API Keys
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-teal-200/70">
              Manage the publishable key used by your storefront integration and search widget.
            </p>
          </div>

          <button
            onClick={() => void createKey()}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-xl bg-[#159478] hover:bg-[#128168] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#159478]/25 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Plus className="size-4" />
            <span>{creating ? "Generating..." : "Generate key"}</span>
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 dark:border-[#1b4852] bg-white dark:bg-[#11343A] p-6 shadow-sm transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#159478]/15 border border-[#159478]/30 flex items-center justify-center text-[#159478]">
                <KeyRound className="size-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  Active Publishable Key
                </p>
                <p className="font-mono text-xs text-slate-500 dark:text-teal-200/80 mt-0.5">
                  {loading ? "Loading key..." : maskedKey ?? "No active publishable key"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {publishableKey && (
                <>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-[#235862] hover:border-[#159478] bg-slate-50 dark:bg-[#163f47] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-teal-100 transition-colors"
                  >
                    {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    <span>{copied ? "Copied" : "Copy Key"}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#1b4852] flex items-center gap-2 text-xs text-slate-500 dark:text-teal-200/70">
            <ShieldCheck className="size-4 text-[#159478]" />
            <span>The widget embed wizard automatically retrieves your active key.</span>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-xs font-semibold text-rose-500">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
