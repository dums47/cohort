"use client"

import React from "react"

interface FeaturesSectionProps {
  onOpenSandbox: () => void
  onOpenSetup: () => void
}

export function FeaturesSection({ onOpenSandbox, onOpenSetup }: FeaturesSectionProps) {
  const features = [
    {
      icon: "fa-brain",
      iconColor: "text-[#159478]",
      bgGlow: "from-[#159478]/20 to-transparent",
      title: "Natural Shopping Intent",
      description:
        "Customers don't shop with exact SKUs. They ask for 'sweatproof headphones for running' or 'quiet office keyboard'. ShopMate parses multi-attribute intent, budget, and context instantly.",
      badge: "Semantic AI",
    },
    {
      icon: "fa-bolt-lightning",
      iconColor: "text-[#E08E45]",
      bgGlow: "from-[#E08E45]/20 to-transparent",
      title: "Sub-150ms Hybrid Vector Search",
      description:
        "Combining ultra-fast BM25 Meilisearch lexical indexing with vector semantic embeddings to deliver lightning search results before the user even finishes typing.",
      badge: "Real-Time Engine",
    },
    {
      icon: "fa-database",
      iconColor: "text-teal-300",
      bgGlow: "from-teal-500/20 to-transparent",
      title: "Zero Schema Lock-In",
      description:
        "Whether you're running Prisma, PostgreSQL, Shopify, or headless GraphQL, just post your existing catalog JSON. No schema alterations or vendor migrations needed.",
      badge: "Drop-in API",
    },
  ]

  const metrics = [
    { value: "< 150ms", label: "Average Query Latency", note: "Powered by Meilisearch" },
    { value: "3.4x", label: "Higher Search Conversion", note: "Compared to keyword search" },
    { value: "50M+", label: "Monthly AI Searches", note: "Indexed & processed safely" },
    { value: "99.99%", label: "Guaranteed SLA Uptime", note: "Enterprise multi-region" },
  ]

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#159478]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#159478]/15 border border-[#159478]/40 text-xs font-semibold text-emerald-300 mb-4">
            <i className="fa-solid fa-sparkles text-[10px]"></i>
            <span>Next-Gen Commerce Discovery</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-4">
            Built for Modern E-Commerce Stores
          </h2>

          <p className="text-sm sm:text-base text-[#95b0b5] leading-relaxed">
            Stop losing sales to &ldquo;No products found&rdquo; error screens. ShopMate transforms
            imprecise customer searches into high-converting, personalized product recommendations.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {features.map((f) => (
            <div
              key={f.title}
              className="relative rounded-2xl bg-[#11343A] border border-[#1b4852] p-6 sm:p-7 shadow-xl shadow-black/40 hover:border-[#159478]/70 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#0e2a30] border border-[#1b4852] flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                    <i className={`fa-solid ${f.icon} ${f.iconColor}`}></i>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#163f47] text-teal-200 border border-[#235862]">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2.5 tracking-tight group-hover:text-teal-200 transition-colors">
                  {f.title}
                </h3>

                <p className="text-xs sm:text-sm text-teal-200/70 leading-relaxed">
                  {f.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1b4852]/80 flex items-center justify-between text-xs text-teal-300 font-medium">
                <button
                  type="button"
                  onClick={onOpenSandbox}
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Test in Sandbox</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Metrics Row */}
        <div className="rounded-2xl bg-[#11343A]/80 border border-[#1b4852] p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {metrics.map((m) => (
              <div key={m.label} className="text-center sm:text-left">
                <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif mb-1 text-[#159478]">
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-teal-100 mb-0.5">
                  {m.label}
                </div>
                <div className="text-[11px] text-teal-300/60 font-mono">
                  {m.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
