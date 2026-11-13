"use client"

import React from "react"

interface HeroLeftProps {
  onOpenSandbox: () => void
  onOpenSetup: () => void
}

export function HeroLeft({ onOpenSandbox, onOpenSetup }: HeroLeftProps) {
  return (
    <div className="flex flex-col items-start justify-center pt-4 sm:pt-6 lg:pt-10">
      {/* Prominent circular teal magnifying glass badge */}
      <div className="relative mb-6">
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#159478] flex items-center justify-center text-white shadow-xl shadow-[#159478]/40 ring-4 ring-[#159478]/20 transition-transform duration-300 hover:scale-105">
          <i className="fa-solid fa-magnifying-glass text-2xl sm:text-3xl"></i>
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#E08E45] border-2 border-[#0d272c] flex items-center justify-center">
          <i className="fa-solid fa-sparkles text-[9px] text-white"></i>
        </div>
      </div>

      {/* Small uppercase category badge */}
      <div className="inline-flex items-center gap-2 mb-3">
        <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#159478] uppercase">
          AI-POWERED E-COMMERCE SEARCH
        </span>
      </div>

      {/* Serif headline */}
      <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-3">
        ShopMate
      </h1>

      {/* Sub-headline in warm amber */}
      <h2 className="text-[#E08E45] font-semibold text-2xl sm:text-3xl tracking-tight mb-5">
        Search Smarter. Shop Better.
      </h2>

      {/* Short description */}
      <p className="text-[#95b0b5] text-base sm:text-lg leading-relaxed max-w-xl mb-8">
        A developer-first API that turns everyday shopping language into structured
        product search for any online store.
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
        {/* Primary: Launch Search Sandbox / Try Live Search */}
        <button
          onClick={onOpenSandbox}
          type="button"
          className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold text-white bg-[#159478] hover:bg-[#128168] shadow-lg shadow-[#159478]/30 hover:shadow-xl hover:shadow-[#159478]/40 transition-all duration-200 cursor-pointer active:scale-95 text-sm sm:text-base"
        >
          <i className="fa-solid fa-magnifying-glass text-sm"></i>
          <span>Try Live Search</span>
        </button>

        {/* Secondary: How to Set Up / View Documentation */}
        <button
          onClick={onOpenSetup}
          type="button"
          className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-medium text-teal-100 bg-[#163f47]/90 hover:bg-[#1b4e57] border border-[#235862] hover:border-[#2d6e7b] shadow-sm transition-all duration-200 cursor-pointer active:scale-95 text-sm sm:text-base"
        >
          <i className="fa-solid fa-circle-info text-teal-300"></i>
          <span>How to Set Up</span>
        </button>
      </div>

      {/* Tech Stack Pills (matching screenshot) */}
      <div className="flex flex-wrap items-center gap-5 sm:gap-6 pt-3 text-xs sm:text-sm font-medium text-teal-200/80">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-bolt text-[#E08E45]"></i>
          <span>&lt;150ms Meilisearch</span>
        </div>

        <div className="flex items-center gap-2">
          <i className="fa-solid fa-brain text-teal-400"></i>
          <span>Natural Intent AI</span>
        </div>

        <div className="flex items-center gap-2">
          <i className="fa-solid fa-database text-teal-400"></i>
          <span>Prisma + Postgres</span>
        </div>
      </div>
    </div>
  )
}
