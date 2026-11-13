"use client"

import React from "react"
import Link from "next/link"

interface FooterProps {
  onOpenPrivacy: () => void
  onOpenStatus: () => void
  onOpenTerms: () => void
  onOpenSetup: () => void
  onOpenSandbox: () => void
}

export function Footer({
  onOpenPrivacy,
  onOpenStatus,
  onOpenTerms,
  onOpenSetup,
  onOpenSandbox,
}: FooterProps) {
  return (
    <footer className="w-full bg-[#08181b] border-t border-[#1b4852] text-teal-200/80 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#1b4852]/70">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#159478] flex items-center justify-center text-white shadow-sm">
                <i className="fa-solid fa-magnifying-glass text-xs"></i>
              </div>
              <span className="font-serif font-bold text-2xl text-white">ShopMate</span>
              <span className="text-[10px] font-mono tracking-widest text-[#159478] uppercase px-2 py-0.5 rounded-full bg-[#159478]/15 border border-[#159478]/30">
                API v2.4
              </span>
            </div>

            <p className="text-xs sm:text-sm text-teal-200/70 max-w-sm leading-relaxed">
              The developer-first search API that transforms natural consumer language into
              structured product discovery for modern e-commerce storefronts.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-[#27c93f] animate-pulse"></span>
              <span>All API clusters operational (24ms response)</span>
            </div>
          </div>

          {/* Product & Developer Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform & Tools
            </h4>
            <ul className="space-y-2 text-xs text-teal-200/80">
              <li>
                <button
                  type="button"
                  onClick={onOpenSandbox}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Live Search Sandbox
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSetup}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Quick Setup & Integration
                </button>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Merchant Console
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors"
                >
                  System Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Status Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Trust & Security
            </h4>
            <ul className="space-y-2 text-xs text-teal-200/80">
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenStatus}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  API Status
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <span className="text-teal-300/50">GDPR & CCPA Compliant</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-teal-300/60">
          <p>© 2026 ShopMate Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-teal-200 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={onOpenStatus}
              className="hover:text-teal-200 transition-colors cursor-pointer"
            >
              API Status
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-teal-200 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
