"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Sparkles } from "lucide-react"
import { IntegrationWizard } from "@/components/integration-wizard"

const metrics = [
  { label: "Searches this month", value: "24,892", delta: "+18.4%" },
  { label: "Product click-through", value: "12.8%", delta: "+2.1%" },
  { label: "Avg. response time", value: "184ms", delta: "-24ms" },
]

export default function DashboardPage() {
  const [showIntegration, setShowIntegration] = useState(false)
  const [color, setColor] = useState("#6d5dfc")

  return <section className="flex flex-col gap-6 p-6 md:p-10">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Developer console</p>
        <h1 className="text-3xl font-semibold tracking-tight">Good morning, Alex</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your search layer is ready to power every storefront touchpoint.</p>
      </div>
      <button onClick={() => setShowIntegration(true)} className="flex items-center gap-2 rounded-xl bg-[#6d5dfc] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_#6d5dfc33]">
        <Plus className="size-4" /> Add integration
      </button>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => <article key={metric.label} className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">{metric.label}</p>
        <div className="mt-3 flex items-end justify-between">
          <strong className="text-2xl font-semibold tracking-tight">{metric.value}</strong>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{metric.delta}</span>
        </div>
      </article>)}
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <article className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold">Store integration</h2>
            <p className="mt-1 text-xs text-muted-foreground">Sync your catalog and install the storefront widget.</p>
          </div>
          <Link href="/dashboard/keys" className="rounded-lg border border-input px-3 py-2 text-xs font-semibold">Manage keys</Link>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted-foreground">Use the setup wizard to upload a catalog, connect a sync source, and get your active-key widget embed code.</p>
          <button onClick={() => setShowIntegration(true)} className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Set up storefront</button>
        </div>
      </article>

      <article className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">Widget appearance</h2>
          <p className="mt-1 text-xs text-muted-foreground">Make the assistant feel native to your storefront.</p>
        </div>
        <div className="flex flex-col gap-5 p-5">
          <label className="flex flex-col gap-2 text-sm font-medium">Brand name<input className="rounded-xl border border-input px-3 py-2.5 text-sm outline-none focus:border-[#6d5dfc]" defaultValue="Shopmate AI" /></label>
          <label className="flex flex-col gap-2 text-sm font-medium">Primary color
            <div className="flex items-center gap-3">
              <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="size-10 cursor-pointer rounded-lg border-0 bg-transparent" />
              <span className="font-mono text-sm text-muted-foreground">{color}</span>
            </div>
          </label>
          <div className="rounded-2xl bg-muted p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Sparkles className="size-3.5" style={{ color }} /> Live preview</div>
            <div className="flex items-center justify-between rounded-xl bg-card p-3 shadow-sm">
              <span className="text-sm font-semibold">Shopmate AI</span>
              <span className="flex size-8 items-center justify-center rounded-full text-white" style={{ backgroundColor: color }}><Sparkles className="size-4" /></span>
            </div>
          </div>
          <button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">Save changes</button>
        </div>
      </article>
    </div>

    <IntegrationWizard open={showIntegration} onClose={() => setShowIntegration(false)} />
  </section>
}
