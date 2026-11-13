"use client"

import React, { useState, useMemo } from "react"
import Image from "next/image"

interface StorefrontCardProps {
  onOpenSandbox: () => void
  onOpenAskShopMate: () => void
  onOpenApiFeed: () => void
}

const previewCatalog = [
  {
    id: "81QFM3",
    sku: "ELC-WC-881",
    name: "Aura Wireless Headphones",
    category: "Electronics",
    price: "$299.99",
    stock: 45,
    inStock: true,
    bgClass: "bg-[#F59E0B]",
    // Clean, crisp headphone rendering
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    alt: "Aura Wireless Headphones"
  },
  {
    id: "924GB0",
    sku: "ELC-KB-982",
    name: "Pulse Mechanical Keyboard",
    category: "Electronics",
    price: "$139.50",
    stock: 82,
    inStock: true,
    bgClass: "bg-[#cbd5e1]",
    // Clean, crisp keyboard rendering
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    alt: "Pulse Mechanical Keyboard"
  },
  {
    id: "67VBN1",
    sku: "APP-HD-330",
    name: "Merino Tech Hoodie",
    category: "Apparel",
    price: "$88.00",
    stock: 90,
    inStock: true,
    bgClass: "bg-[#1e293b]",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    alt: "Merino Tech Hoodie"
  },
  {
    id: "33TYR9",
    sku: "HMO-DK-554",
    name: "ErgoRiser Bamboo Desk",
    category: "Home & Office",
    price: "$249.99",
    stock: 18,
    inStock: true,
    bgClass: "bg-[#78350f]",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80",
    alt: "ErgoRiser Bamboo Desk"
  },
  {
    id: "48LMN2",
    sku: "FIT-SW-401",
    name: "OmniFit Apex Smartwatch",
    category: "Fitness",
    price: "$189.00",
    stock: 34,
    inStock: true,
    bgClass: "bg-[#0f172a]",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    alt: "OmniFit Apex Smartwatch"
  },
  {
    id: "19XOP8",
    sku: "ACC-BP-112",
    name: "Nomad All-Weather Daypack",
    category: "Accessories",
    price: "$119.00",
    stock: 61,
    inStock: true,
    bgClass: "bg-[#334155]",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    alt: "Nomad All-Weather Daypack"
  }
]

export function StorefrontCard({
  onOpenSandbox,
  onOpenAskShopMate,
  onOpenApiFeed,
}: StorefrontCardProps) {
  const [activeCategory, setActiveCategory] = useState("All Items")
  const [filterText, setFilterText] = useState("")
  const [inStockOnly, setInStockOnly] = useState(true)

  const categories = [
    "All Items",
    "Electronics",
    "Apparel",
    "Home & Office",
    "Fitness",
    "Accessories",
  ]

  const displayedProducts = useMemo(() => {
    return previewCatalog.filter((item) => {
      const matchCat =
        activeCategory === "All Items" ||
        item.category.toLowerCase() === activeCategory.toLowerCase()
      const matchText =
        filterText.trim() === "" ||
        item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.sku.toLowerCase().includes(filterText.toLowerCase()) ||
        item.category.toLowerCase().includes(filterText.toLowerCase())
      const matchStock = !inStockOnly || item.inStock
      return matchCat && matchText && matchStock
    })
  }, [activeCategory, filterText, inStockOnly])

  return (
    <div
      id="mockup-preview"
      className="relative w-full rounded-2xl bg-[#11343A] border border-[#1b4852] shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-sm group/card"
    >
      {/* 1. Browser Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d272c]/90 border-b border-[#1b4852]/80">
        {/* macOS window dots */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm"></span>
        </div>

        {/* Browser URL bar pill */}
        <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#11343a] border border-[#1d4d56] text-[11px] sm:text-xs text-teal-200/90 font-mono tracking-tight shadow-inner">
          <i className="fa-solid fa-lock text-[10px] text-teal-400"></i>
          <span>shopmate-storefront.vercel.app</span>
        </div>

        {/* Click to Launch Interactive Demo Button */}
        <button
          onClick={onOpenSandbox}
          type="button"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium text-emerald-300 bg-[#159478]/15 border border-[#159478]/50 hover:bg-[#159478]/30 transition-all cursor-pointer active:scale-95"
          title="Open interactive sandbox"
        >
          <i className="fa-solid fa-expand text-[10px]"></i>
          <span className="hidden sm:inline">Click to Launch Interactive Demo</span>
          <span className="sm:hidden">Demo</span>
        </button>
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {/* 2. STORE PUBLIC CATALOG FEED container */}
        <div className="rounded-xl bg-[#0e2a30] border border-[#1b4852] p-3 sm:p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold tracking-wider text-teal-300 uppercase">
              STORE PUBLIC CATALOG FEED
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#159478]/20 border border-[#159478]/40 text-[10px] font-semibold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f] animate-pulse"></span>
              <span>Live API</span>
            </div>
          </div>

          <p className="text-xs text-teal-200/70 mb-2.5">
            External crawlers or AI agents can ingest the entire mock catalog via JSON:
          </p>

          {/* Terminal / Code bar */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#08181b] border border-[#1b4852] font-mono text-xs text-teal-300">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              <span className="text-[#159478] font-bold">GET</span>
              <span className="text-teal-100">/api/products</span>
            </div>

            <button
              onClick={onOpenApiFeed}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#163f47] hover:bg-[#1f5661] text-[11px] text-teal-200 hover:text-white border border-[#235862] transition-colors cursor-pointer shrink-0 ml-2"
              title="Inspect JSON API feed"
            >
              <span>Test</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </button>
          </div>
        </div>

        {/* 3. Horizontal Category Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-white text-[#0d272c] shadow-sm font-bold"
                    : "bg-[#163f47]/60 text-teal-200/80 hover:bg-[#163f47] hover:text-white border border-[#1d4d56]/50"
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* 4. Filter search bar + In Stock toggle + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-teal-400/60 text-xs"></i>
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter title, description, SKU..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0e2a30] border border-[#1b4852] text-xs text-white placeholder-teal-300/40 focus:outline-none focus:border-[#159478] transition-colors"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-teal-200/80">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-[#159478] w-3.5 h-3.5 cursor-pointer"
              />
              <span className="text-[11px] sm:text-xs">In Stock only</span>
            </label>

            <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#0e2a30] border border-[#1b4852] text-[11px] cursor-pointer hover:border-teal-500/50">
              <span>Featured</span>
              <i className="fa-solid fa-chevron-down text-[9px] text-teal-400"></i>
            </div>
          </div>
        </div>

        {/* 5. Product Preview Grid (Cards 1 & 2 matching screenshot) */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {displayedProducts.slice(0, 2).map((product) => (
            <div
              key={product.id}
              onClick={onOpenSandbox}
              className="group/product rounded-xl bg-[#0e2a30] border border-[#1b4852] hover:border-[#159478]/70 p-3 flex flex-col transition-all duration-200 hover:shadow-lg hover:shadow-black/40 cursor-pointer relative"
            >
              {/* Product Thumbnail Container */}
              <div
                className={`relative w-full h-36 sm:h-40 rounded-lg overflow-hidden flex items-center justify-center ${product.bgClass}`}
              >
                {/* Badges on top of image */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-white backdrop-blur-sm border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    {product.category}
                  </span>
                </div>

                <div className="absolute top-2 right-2 z-10">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#159478] text-white shadow-sm">
                    In Stock ({product.stock})
                  </span>
                </div>

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover object-center group-hover/product:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/product:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1 rounded-full bg-white/90 text-[#0d272c] text-xs font-semibold shadow-md">
                    Launch in Sandbox ↗
                  </span>
                </div>
              </div>

              {/* SKU & ID metadata row */}
              <div className="flex items-center justify-between text-[10px] font-mono text-teal-300/60 mt-2.5 mb-1">
                <span>{product.sku}</span>
                <span>ID: {product.id}</span>
              </div>

              {/* Product Name */}
              <h3 className="font-semibold text-xs sm:text-sm text-white line-clamp-1 group-hover/product:text-teal-200 transition-colors">
                {product.name}
              </h3>

              {/* Price in Bright Teal */}
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[#159478] font-bold text-sm sm:text-base">
                  {product.price}
                </span>
                <span className="text-[10px] text-teal-300/60">USD</span>
              </div>
            </div>
          ))}

          {displayedProducts.length === 0 && (
            <div className="col-span-2 py-8 text-center text-teal-300/70 text-xs">
              No products found matching &ldquo;{filterText}&rdquo;. Try another filter or search in the sandbox.
            </div>
          )}

          {/* 6. Floating purple "Ask ShopMate" badge anchored at bottom right */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenAskShopMate()
            }}
            type="button"
            className="absolute -bottom-2 right-1 sm:-bottom-2 sm:right-2 z-20 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs sm:text-sm font-semibold shadow-xl shadow-[#6366f1]/40 border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Ask ShopMate AI shopping assistant"
          >
            <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
            <span>Ask ShopMate</span>
          </button>
        </div>
      </div>
    </div>
  )
}
