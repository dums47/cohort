"use client"

import React, { useState, useMemo } from "react"
import { useToast } from "../toast"

interface SearchSandboxModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
  stock: number
  inStock: boolean
  rating: number
  reviewsCount: number
  description: string
  image: string
  accentColor: string
  tags: string[]
}

const mockCatalog: Product[] = [
  {
    id: "81QFM3",
    sku: "ELC-WC-881",
    name: "Aura Wireless Headphones",
    category: "Electronics",
    price: 299.99,
    stock: 45,
    inStock: true,
    rating: 4.9,
    reviewsCount: 128,
    description: "Industry-leading active noise cancellation with 40-hour battery life, ultra-plush memory foam earcups, and studio-grade acoustics.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    accentColor: "#F59E0B",
    tags: ["audio", "bluetooth", "anc", "headphones", "wireless", "sound", "gym"]
  },
  {
    id: "924GB0",
    sku: "ELC-KB-982",
    name: "Pulse Mechanical Keyboard",
    category: "Electronics",
    price: 139.50,
    stock: 82,
    inStock: true,
    rating: 4.8,
    reviewsCount: 94,
    description: "Compact 75% mechanical keyboard with hot-swappable linear quiet switches, RGB backlighting, and CNC anodized aluminum chassis.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    accentColor: "#cbd5e1",
    tags: ["keyboard", "mechanical", "gaming", "office", "swappable", "typing", "quiet"]
  },
  {
    id: "48LMN2",
    sku: "FIT-SW-401",
    name: "OmniFit Apex Smartwatch",
    category: "Fitness",
    price: 189.00,
    stock: 34,
    inStock: true,
    rating: 4.7,
    reviewsCount: 67,
    description: "Rugged fitness smartwatch with sapphire AMOLED display, precision biometric tracking, and 7-day battery life.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    accentColor: "#0F172A",
    tags: ["smartwatch", "fitness", "gps", "waterproof", "running", "heart rate"]
  },
  {
    id: "19XOP8",
    sku: "ACC-BP-112",
    name: "Nomad All-Weather Daypack",
    category: "Accessories",
    price: 119.00,
    stock: 61,
    inStock: true,
    rating: 4.9,
    reviewsCount: 210,
    description: "Weatherproof recycled Cordura nylon backpack with dedicated 16-inch laptop compartment and magnetic fidlock closure.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    accentColor: "#334155",
    tags: ["backpack", "travel", "waterproof", "laptop", "bag", "commute"]
  },
  {
    id: "67VBN1",
    sku: "APP-HD-330",
    name: "Merino Tech Heavyweight Hoodie",
    category: "Apparel",
    price: 88.00,
    stock: 90,
    inStock: true,
    rating: 4.6,
    reviewsCount: 83,
    description: "Ultra-soft thermal regulating merino wool blend hoodie with hidden kangaroo zipper pocket and thumbhole cuffs.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    accentColor: "#1E293B",
    tags: ["apparel", "hoodie", "merino", "warm", "sweater", "clothing"]
  },
  {
    id: "33TYR9",
    sku: "HMO-DK-554",
    name: "ErgoRiser Bamboo Standing Desk",
    category: "Home & Office",
    price: 249.99,
    stock: 18,
    inStock: true,
    rating: 4.8,
    reviewsCount: 51,
    description: "Dual-tier pneumatic standing desk riser crafted from sustainable solid bamboo with integrated cable raceway.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80",
    accentColor: "#78350F",
    tags: ["desk", "ergonomic", "standing", "bamboo", "office", "workspace", "furniture"]
  }
]

export function SearchSandboxModal({ isOpen, onClose }: SearchSandboxModalProps) {
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Items")
  const [inStockOnly, setInStockOnly] = useState(false)
  const [viewMode, setViewMode] = useState<"visual" | "json">("visual")

  const categories = ["All Items", "Electronics", "Apparel", "Home & Office", "Fitness", "Accessories"]

  const samplePrompts = [
    "wireless headphones for gym",
    "quiet mechanical keyboard for office",
    "waterproof tech backpack",
    "bamboo standing desk converter",
    "merino wool warm hoodie"
  ]

  const filteredProducts = useMemo(() => {
    return mockCatalog.filter((item) => {
      const matchCat =
        selectedCategory === "All Items" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchStock = !inStockOnly || item.inStock

      if (!searchQuery.trim()) return matchCat && matchStock

      const q = searchQuery.toLowerCase().trim()
      const matchText =
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q) || q.includes(tag))

      return matchCat && matchStock && matchText
    })
  }, [searchQuery, selectedCategory, inStockOnly])

  if (!isOpen) return null

  const handleCopyJson = () => {
    const jsonString = JSON.stringify(
      {
        status: 200,
        query: searchQuery || "all",
        category: selectedCategory,
        latency_ms: 22,
        engine: "ShopMate Hybrid Meilisearch",
        semantic_confidence: "98.9%",
        count: filteredProducts.length,
        results: filteredProducts
      },
      null,
      2
    )
    navigator.clipboard.writeText(jsonString)
    showToast("API JSON response copied to clipboard!", "success")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl rounded-2xl bg-[#11343A] border border-[#1b4852] shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-[#0d272c] border-b border-[#1b4852]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#159478] flex items-center justify-center text-white shadow-md shadow-[#159478]/30">
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  ShopMate Live Search Sandbox
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-[#159478]/40 text-[10px] font-semibold text-emerald-300">
                  Sub-150ms Meilisearch
                </span>
              </div>
              <p className="text-xs text-teal-300/70">
                Experience natural language product discovery in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Switcher */}
            <div className="flex rounded-lg bg-[#0e2a30] border border-[#1b4852] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("visual")}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                  viewMode === "visual"
                    ? "bg-[#159478] text-white shadow-sm"
                    : "text-teal-200/70 hover:text-white"
                }`}
              >
                <i className="fa-solid fa-grid-2 mr-1.5 text-[11px]"></i>
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("json")}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                  viewMode === "json"
                    ? "bg-[#159478] text-white shadow-sm"
                    : "text-teal-200/70 hover:text-white"
                }`}
              >
                <i className="fa-solid fa-code mr-1.5 text-[11px]"></i>
                <span>Raw JSON</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#163f47] hover:bg-[#1f5661] text-teal-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        {/* Search Controls Bar */}
        <div className="p-4 sm:p-6 bg-[#0e2a30] border-b border-[#1b4852] space-y-3.5">
          {/* Main Search Input */}
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 text-sm"></i>
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search with everyday natural language (e.g. 'headphones with active noise canceling for travel')..."
              className="w-full pl-11 pr-24 py-3 rounded-xl bg-[#08181b] border border-[#1b4852] text-sm text-white placeholder-teal-300/40 focus:outline-none focus:border-[#159478] shadow-inner transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-teal-400/60 hover:text-teal-200 text-xs px-2 cursor-pointer"
              >
                Clear
              </button>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-[#163f47] text-[10px] font-mono text-teal-300/80">
              ~21ms
            </div>
          </div>

          {/* Prompt Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-teal-300/60 text-[11px] shrink-0 font-medium">Try asking:</span>
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setSearchQuery(prompt)}
                className="px-2.5 py-1 rounded-full bg-[#163f47]/60 hover:bg-[#163f47] text-teal-200 hover:text-white border border-[#235862] text-[11px] whitespace-nowrap transition cursor-pointer"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#159478] text-white shadow-sm"
                      : "bg-[#163f47]/50 text-teal-200/70 hover:bg-[#163f47] hover:text-white border border-[#1b4852]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-teal-200/80">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded accent-[#159478] w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-xs">In Stock Only</span>
              </label>

              <span className="text-xs text-teal-300/60">
                {filteredProducts.length} items found
              </span>
            </div>
          </div>

          {/* Semantic Analysis Bar */}
          {searchQuery && (
            <div className="p-2.5 rounded-lg bg-[#163f47]/40 border border-[#235862] flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-teal-200">
                <i className="fa-solid fa-wand-magic-sparkles text-[#E08E45]"></i>
                <span>
                  Semantic Analysis: Interpreted as <span className="font-semibold text-white">&ldquo;{searchQuery}&rdquo;</span> in category <span className="text-emerald-300">{selectedCategory}</span>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#159478]/20 text-[#159478] font-mono text-[10px] font-bold">
                98.9% Intent Match
              </span>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {viewMode === "visual" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-xl bg-[#0e2a30] border border-[#1b4852] hover:border-[#159478] p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:shadow-black/50"
                >
                  <div>
                    {/* Image container */}
                    <div
                      className="relative w-full h-40 rounded-lg overflow-hidden flex items-center justify-center mb-3"
                      style={{ backgroundColor: product.accentColor }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm border border-white/10">
                          {product.category}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#159478] text-white">
                          In Stock ({product.stock})
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-teal-300/60 mb-1">
                      <span>{product.sku}</span>
                      <span>ID: {product.id}</span>
                    </div>

                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-teal-200 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-xs text-teal-200/70 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price and actions */}
                  <div className="mt-4 pt-3 border-t border-[#1b4852] flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-[#159478]">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-teal-300/60 ml-1">USD</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast(`Simulated cart add: ${product.name}`, "success")}
                      className="px-3 py-1 rounded-lg bg-[#163f47] hover:bg-[#159478] text-xs font-semibold text-teal-100 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-cart-plus text-[10px]"></i>
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full py-16 text-center text-teal-200/60 flex flex-col items-center justify-center">
                  <i className="fa-solid fa-magnifying-glass text-3xl mb-3 text-teal-500/40"></i>
                  <p className="text-sm font-semibold text-white">No products found</p>
                  <p className="text-xs text-teal-300/70 mt-1 max-w-sm">
                    Try searching for &ldquo;headphones&rdquo;, &ldquo;keyboard&rdquo;, &ldquo;smartwatch&rdquo;, or click on a suggested query above.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* JSON View */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-teal-300 font-mono">
                  GET /api/products?q={encodeURIComponent(searchQuery)}
                </span>
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded bg-[#163f47] hover:bg-[#1f5661] text-xs font-medium text-teal-200 hover:text-white border border-[#235862] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <i className="fa-regular fa-copy text-xs"></i>
                  <span>Copy Raw JSON</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#08181b] border border-[#1b4852] font-mono text-xs text-teal-100 overflow-x-auto leading-relaxed max-h-[500px]">
                <code>
                  {JSON.stringify(
                    {
                      status: 200,
                      engine: "ShopMate Natural Intent v2.4",
                      query: searchQuery,
                      category: selectedCategory,
                      latency_ms: 22,
                      total: filteredProducts.length,
                      products: filteredProducts
                    },
                    null,
                    2
                  )}
                </code>
              </pre>
            </div>
          )}
        </div>

        {/* Modal Bottom Banner */}
        <div className="px-6 py-3 bg-[#0d272c] border-t border-[#1b4852] flex items-center justify-between text-xs text-teal-300/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#159478] animate-pulse"></span>
            <span>Connected to Local Mock Index (6 Products Cached)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#163f47] hover:bg-[#1f5661] text-white font-medium transition cursor-pointer"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  )
}
