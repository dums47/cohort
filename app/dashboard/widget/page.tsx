"use client"

import { useState } from "react"

export default function WidgetPage() {
  const [brand, setBrand] = useState("Shopmate")
  const snippet = `<script src="https://cdn.shopmate.dev/widget.js" data-brand="${brand}"></script>`
  return <section className="p-6 md:p-10"><div className="mx-auto max-w-5xl"><p className="text-sm font-medium text-primary">Merchant portal</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Widget studio</h1><p className="mt-2 text-muted-foreground">Tune the storefront assistant, then paste one script tag into your store.</p><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]"><div className="rounded-2xl border border-border bg-card p-5"><label className="text-sm font-medium" htmlFor="brand">Brand name</label><input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none ring-primary focus:ring-2" /><label className="mt-5 block text-sm font-medium" htmlFor="position">Position</label><select id="position" className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2"><option>Bottom right</option><option>Bottom left</option></select></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm font-medium">Install snippet</p><pre className="mt-3 overflow-auto rounded-xl bg-muted p-4 text-xs text-muted-foreground"><code>{snippet}</code></pre><button onClick={() => navigator.clipboard.writeText(snippet)} className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Copy snippet</button></div></div></div></section>
}
