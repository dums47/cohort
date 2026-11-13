"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Sparkles, KeyRound, ExternalLink } from "lucide-react"
import { IntegrationWizard } from "@/components/integration-wizard"

export default function DashboardPage() {
  const [showIntegration, setShowIntegration] = useState(false)
  const [color, setColor] = useState("#159478")

  return (
    <section className="flex flex-col gap-6 p-6 md:p-10 transition-colors duration-300">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#159478]">
            Merchant console
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-teal-200/70">
            Manage your storefront integration, catalog search indexing, and widget appearance.
          </p>
        </div>

        {/* Primary button using exact landing page teal */}
        <button
          onClick={() => setShowIntegration(true)}
          className="flex items-center gap-2 rounded-xl bg-[#159478] hover:bg-[#128168] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#159478]/30 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="size-4" /> Add integration
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        {/* Left Card: Store integration */}
        <article className="rounded-2xl border border-slate-200 dark:border-[#1b4852] bg-white dark:bg-[#11343A] shadow-sm overflow-hidden transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1b4852] px-6 py-4">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Store integration
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-teal-200/70">
                Add the AI search widget to your storefront in one simple step.
              </p>
            </div>
            <Link
              href="/dashboard/keys"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-[#235862] hover:border-[#159478] bg-slate-50 dark:bg-[#163f47] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-teal-100 transition-colors"
            >
              <KeyRound className="size-3.5 text-[#159478]" />
              <span>Manage keys</span>
            </Link>
          </div>

          <div className="p-6">
            <p className="text-sm text-slate-600 dark:text-teal-100/80 leading-relaxed">
              Copy your personalized script tag, add it to your site, and verify that the widget is live. Search rendering, Meilisearch vector querying, and real-time product discovery are handled automatically.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setShowIntegration(true)}
                className="rounded-xl bg-[#159478] hover:bg-[#128168] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#159478]/20 transition-all cursor-pointer active:scale-95"
              >
                Embed AI Search Widget
              </button>

              <Link
                href="/dashboard/widget"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-[#235862] hover:bg-slate-50 dark:hover:bg-[#163f47] px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-teal-100 transition-colors"
              >
                <span>Full Widget Guide</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>
        </article>

        {/* Right Card: Widget appearance */}
        <article className="rounded-2xl border border-slate-200 dark:border-[#1b4852] bg-white dark:bg-[#11343A] shadow-sm overflow-hidden transition-colors">
          <div className="border-b border-slate-100 dark:border-[#1b4852] px-6 py-4">
            <h2 className="font-bold text-slate-900 dark:text-white text-base">
              Widget appearance
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-teal-200/70">
              Make the assistant feel native to your storefront theme.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-6">
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700 dark:text-teal-200">
              Brand name
              <input
                className="rounded-xl border border-slate-300 dark:border-[#1b4852] bg-white dark:bg-[#08181b] text-slate-900 dark:text-white px-3.5 py-2.5 text-sm outline-none focus:border-[#159478] transition-colors"
                defaultValue="ShopMate"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700 dark:text-teal-200">
              Accent theme color
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="size-10 cursor-pointer rounded-xl border border-slate-300 dark:border-[#1b4852] bg-transparent p-0.5"
                />
                <span className="font-mono text-sm text-slate-600 dark:text-teal-200/80">
                  {color}
                </span>
              </div>
            </label>

            {/* Live Preview Box */}
            <div className="rounded-xl bg-slate-50 dark:bg-[#08181b] border border-slate-200 dark:border-[#1b4852] p-4">
              <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-teal-300/70">
                <Sparkles className="size-3.5" style={{ color }} />
                <span>Live widget preview</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white dark:bg-[#11343A] border border-slate-200 dark:border-[#1b4852] p-3 shadow-sm">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  ShopMate Search
                </span>
                <span
                  className="flex size-8 items-center justify-center rounded-full text-white shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  <Sparkles className="size-4" />
                </span>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl bg-[#159478] hover:bg-[#128168] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#159478]/20 transition-all cursor-pointer active:scale-95"
            >
              Save changes
            </button>
          </div>
        </article>
      </div>

      <IntegrationWizard open={showIntegration} onClose={() => setShowIntegration(false)} />
    </section>
  )
}
