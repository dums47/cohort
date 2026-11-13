"use client"

import React, { useState } from "react"
import { useToast } from "./toast"

export function CodeShowcase({ onOpenSetup }: { onOpenSetup: () => void }) {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<"curl" | "typescript" | "python" | "react">("typescript")

  const snippets = {
    typescript: `import { ShopMate } from "@shopmate/sdk"

// Initialize client with merchant key
const shopmate = new ShopMate({
  apiKey: process.env.SHOPMATE_API_KEY!,
  endpoint: "https://api.shopmate.ai"
})

// Search with everyday human language
const { data, meta } = await shopmate.search({
  query: "comfortable wireless headphones for long flights under $300",
  filters: { inStock: true }
})

console.log(\`Matched \${data.length} items in \${meta.latencyMs}ms\`)`,

    curl: `curl -X POST https://api.shopmate.ai/api/v1/search \\
  -H "Authorization: Bearer pk_live_shopmate_992a7fe1b04" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "silent mechanical keyboard linear switches",
    "limit": 5,
    "includeIntent": true
  }'`,

    python: `from shopmate import ShopMateClient

client = ShopMateClient(api_key="pk_live_shopmate_992a7fe1b04")

response = client.search(
    query="breathable workout hoodie with zipper",
    category="Apparel",
    in_stock_only=True
)

for product in response.results:
    print(f"{product.name} - \${product.price} ({product.match_score}%)")`,

    react: `import { useShopMateSearch } from "@shopmate/react"

export function SearchBar() {
  const { query, setQuery, results, isSearching, latency } = useShopMateSearch({
    debounceMs: 120
  })

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search with conversational intent..."
      />
      <span>{latency}ms response</span>
      {results.map(item => <ProductCard key={item.id} {...item} />)}
    </div>
  )
}`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab])
    showToast(`Copied ${activeTab.toUpperCase()} code snippet!`, "success")
  }

  return (
    <section id="developer-code" className="py-16 sm:py-24 border-t border-[#1b4852]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#159478]/15 border border-[#159478]/40 text-xs font-semibold text-emerald-300">
              <i className="fa-solid fa-code text-[11px]"></i>
              <span>Developer-First Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              Integrate in Minutes, Not Months.
            </h2>

            <p className="text-[#95b0b5] text-sm sm:text-base leading-relaxed">
              Standard REST endpoints, lightweight SDKs, and zero schema lock-in. Send your raw catalog JSON, and ShopMate automatically builds hybrid lexical and vector embeddings for instant semantic search.
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-teal-200/90 pt-2">
              <li className="flex items-center gap-2.5">
                <i className="fa-solid fa-circle-check text-[#159478]"></i>
                <span>Zero re-indexing downtime with instant cache invalidation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fa-solid fa-circle-check text-[#159478]"></i>
                <span>Auto-normalization for typos, synonyms, and currency units</span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fa-solid fa-circle-check text-[#159478]"></i>
                <span>Drop-in drop-shadow UI search widget script included</span>
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={onOpenSetup}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#163f47] hover:bg-[#1f5661] text-teal-100 hover:text-white font-medium text-xs sm:text-sm border border-[#235862] transition cursor-pointer"
              >
                <span>Read Full Integration Guide</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
          </div>

          {/* Right Code Box */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#11343A] border border-[#1b4852] shadow-2xl shadow-black/60 overflow-hidden">
              {/* Tabs header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d272c] border-b border-[#1b4852]">
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                  {(["typescript", "curl", "python", "react"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                        activeTab === tab
                          ? "bg-[#159478] text-white"
                          : "text-teal-300/70 hover:text-white hover:bg-[#163f47]"
                      }`}
                    >
                      {tab === "typescript" ? "TypeScript" : tab === "curl" ? "cURL" : tab === "python" ? "Python" : "React Hook"}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded bg-[#163f47] hover:bg-[#1f5661] text-teal-200 hover:text-white text-xs font-medium border border-[#235862] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <i className="fa-regular fa-copy text-xs"></i>
                  <span>Copy</span>
                </button>
              </div>

              {/* Code display */}
              <div className="p-4 sm:p-5 bg-[#08181b] overflow-x-auto">
                <pre className="font-mono text-xs sm:text-sm text-teal-100 leading-relaxed">
                  <code>{snippets[activeTab]}</code>
                </pre>
              </div>

              {/* Status bar */}
              <div className="px-4 py-2 bg-[#0e2a30] border-t border-[#1b4852] flex items-center justify-between text-[11px] font-mono text-teal-300/70">
                <span>SDK Version: v2.4.1</span>
                <span>Response SLA: &lt;150ms Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
