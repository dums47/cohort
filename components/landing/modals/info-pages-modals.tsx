"use client"

import React from "react"

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
  type: "privacy" | "status" | "terms"
}

export function InfoPagesModal({ isOpen, onClose, type }: InfoModalProps) {
  if (!isOpen) return null

  const titles = {
    privacy: "Privacy Policy",
    status: "ShopMate API System Status",
    terms: "Terms of Service",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#11343A] border border-[#1b4852] shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0d272c] border-b border-[#1b4852]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#159478]/20 border border-[#159478]/40 flex items-center justify-center text-[#159478]">
              <i
                className={`fa-solid ${
                  type === "privacy"
                    ? "fa-shield-halved"
                    : type === "status"
                    ? "fa-heart-pulse"
                    : "fa-scale-balanced"
                } text-xs`}
              ></i>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{titles[type]}</h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#163f47] hover:bg-[#1f5661] text-teal-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-teal-100/90 leading-relaxed">
          {type === "privacy" && (
            <>
              <p className="text-teal-300/80">Last Updated: November 2026</p>
              <h3 className="text-base font-bold text-white">1. Data Minimization & Security</h3>
              <p>
                ShopMate operates with strict zero-retention principles on end-consumer personally
                identifiable information (PII). Search queries processed through our endpoint are
                anonymized, vector-tokenized in-memory, and only used to return relevant catalog
                matches.
              </p>
              <h3 className="text-base font-bold text-white">2. Merchant Catalog Ingestion</h3>
              <p>
                Product information synced via <code className="text-[#159478]">/api/v1/products/sync</code> is encrypted at rest using AES-256 and stored exclusively to facilitate sub-150ms Meilisearch retrieval.
              </p>
              <h3 className="text-base font-bold text-white">3. Third-Party Disclosures</h3>
              <p>
                We do not sell search intent telemetry or customer browsing habits to advertising
                networks or data brokers.
              </p>
            </>
          )}

          {type === "status" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0e2a30] border border-[#159478]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#27c93f] animate-ping"></span>
                  <div>
                    <h4 className="font-bold text-white text-sm">All Systems Operational</h4>
                    <p className="text-xs text-teal-200/70">Global Uptime: 99.992% over the last 90 days</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#159478]/20 text-emerald-300 text-xs font-mono font-bold">
                  24ms Avg
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { name: "Public Catalog API (GET /api/products)", status: "Operational", lat: "19ms" },
                  { name: "Meilisearch Vector Index Cluster", status: "Operational", lat: "22ms" },
                  { name: "Natural Language Intent Pipeline", status: "Operational", lat: "38ms" },
                  { name: "Merchant Sync Ingestion Webhooks", status: "Operational", lat: "45ms" },
                  { name: "Auth & API Key Validation", status: "Operational", lat: "14ms" },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#08181b] border border-[#1b4852]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#27c93f]"></span>
                      <span className="text-xs font-medium text-white">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-teal-300/60">{s.lat}</span>
                      <span className="text-[11px] font-semibold text-emerald-400">{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === "terms" && (
            <>
              <p className="text-teal-300/80">Effective Date: November 2026</p>
              <h3 className="text-base font-bold text-white">1. Developer API Licensing</h3>
              <p>
                By using ShopMate APIs, you receive a revocable, non-exclusive license to integrate
                our AI search endpoints into commercial e-commerce applications within your plan&apos;s
                allocated query limits.
              </p>
              <h3 className="text-base font-bold text-white">2. Acceptable Use Policy</h3>
              <p>
                Users agree not to attempt to reverse-engineer our vector embeddings, initiate
                denial-of-service stress tests without written authorization, or transmit malicious
                scripts via catalog sync webhooks.
              </p>
              <h3 className="text-base font-bold text-white">3. SLA & Guarantees</h3>
              <p>
                Enterprise tiers include a 99.9% uptime SLA with proactive failover across multi-region
                PostgreSQL and Meilisearch nodes.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0d272c] border-t border-[#1b4852] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#159478] hover:bg-[#128168] text-white font-semibold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
