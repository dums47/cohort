"use client"

import React from "react"
import Link from "next/link"

interface NavbarProps {
  onOpenSetup: () => void
  onOpenSignIn: () => void
  onOpenSignUp: () => void
}

export function Navbar({ onOpenSetup, onOpenSignIn, onOpenSignUp }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0d272c]/85 border-b border-[#1b454d]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-3.5 group focus:outline-none"
          aria-label="ShopMate Home"
        >
          {/* Circular teal magnifying glass icon */}
          <div className="w-10 h-10 rounded-full bg-[#159478] flex items-center justify-center text-white shadow-md shadow-[#159478]/30 group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-magnifying-glass text-base"></i>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-white font-serif leading-none">
              ShopMate
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-teal-300/80 uppercase mt-0.5">
              SEARCH API
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (desktop subtle) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-teal-100/70">
          <button
            onClick={onOpenSetup}
            className="hover:text-white transition-colors cursor-pointer"
          >
            How it Works
          </button>
          <a
            href="#mockup-preview"
            className="hover:text-white transition-colors"
          >
            Storefront Feed
          </a>
          <a
            href="#developer-code"
            className="hover:text-white transition-colors"
          >
            SDK & Docs
          </a>
          <Link
            href="/dashboard"
            className="hover:text-white transition-colors"
          >
            Merchant Console
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Setup Info Button */}
          <button
            onClick={onOpenSetup}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-teal-100 bg-[#163f47]/90 hover:bg-[#1b4e57] border border-[#235862] hover:border-[#2d6e7b] transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
            aria-label="Setup Info"
          >
            <i className="fa-solid fa-circle-info text-teal-300"></i>
            <span>Setup Info</span>
          </button>

          {/* Sign In Button */}
          <button
            onClick={onOpenSignIn}
            type="button"
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-teal-100/90 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/5 active:scale-95"
          >
            Sign In
          </button>

          {/* Sign Up Button (Prominent Teal) */}
          <button
            onClick={onOpenSignUp}
            type="button"
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#159478] hover:bg-[#128168] shadow-md shadow-[#159478]/30 transition-all duration-200 cursor-pointer active:scale-95 hover:shadow-lg hover:shadow-[#159478]/40"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  )
}
