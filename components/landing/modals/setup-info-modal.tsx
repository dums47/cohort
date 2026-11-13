"use client"

import React, { useState } from "react"
import { useToast } from "../toast"

interface SetupInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenSandbox: () => void
}

export function SetupInfoModal({ isOpen, onClose, onOpenSandbox }: SetupInfoModalProps) {
  const { showToast } = useToast()
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  if (!isOpen) return null

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    showToast(`Copied ${label} to clipboard!`, "success")
  }

  const handleVerify = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
      showToast("ShopMate API endpoint verified! 200 OK (21ms)", "success")
    }, 900)
  }

  const codeSnippets = {
    step1: `# Step 1: Initialize Database & Schema
npx prisma db push

# Optional: Run seed script to populate sample items
pnpm run sync:catalog https://yourstore.com`,

    step2: `# Step 2: Index your product catalog
curl -X POST https://api.shopmate.ai/api/v1/products/sync \\
  -H "Authorization: Bearer pk_live_shopmate_992a7fe1b04" \\
  -H "Content-Type: application/json" \\
  -d '[
    {
      "id": "81QFM3",
      "sku": "ELC-WC-881",
      "name": "Aura Wireless Headphones",
      "category": "Electronics",
      "price": 299.99,
      "inStock": true,
      "description": "Studio-grade ANC headphones with 40h battery."
    }
  ]'`,

    step3: `// Step 3: Connect ShopMate SDK in your frontend/backend
import { ShopMateClient } from "@shopmate/sdk"

const shopmate = new ShopMateClient({
  publishableKey: process.env.NEXT_PUBLIC_SHOPMATE_KEY,
  endpoint: "https://api.shopmate.ai"
})

// Natural shopping search query
const { products, intent, latencyMs } = await shopmate.search({
  query: "quiet mechanical keyboard for programming",
  inStockOnly: true
})

console.log(\`Found \${products.length} matches in \${latencyMs}ms\`)`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[#11343A] border border-[#1b4852] shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0d272c] border-b border-[#1b4852]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#159478]/20 border border-[#159478]/50 flex items-center justify-center text-[#159478]">
              <i className="fa-solid fa-circle-info text-sm"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                ShopMate Quick Setup Guide
              </h2>
              <p className="text-xs text-teal-300/70">
                Deploy AI-powered product search in 3 straightforward steps
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#163f47] hover:bg-[#1f5661] text-teal-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex border-b border-[#1b4852] bg-[#0e2a30] px-6 pt-3 gap-2 overflow-x-auto">
          {[
            { id: 1 as const, title: "1. Database Seed", icon: "fa-database" },
            { id: 2 as const, title: "2. Index Catalog", icon: "fa-cloud-arrow-up" },
            { id: 3 as const, title: "3. Connect AI SDK", icon: "fa-code" },
          ].map((step) => {
            const isActive = activeStep === step.id
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                type="button"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#11343a] text-white border-[#159478]"
                    : "text-teal-200/60 hover:text-teal-100 border-transparent hover:bg-[#163f47]/50"
                }`}
              >
                <i className={`fa-solid ${step.icon} ${isActive ? "text-[#159478]" : ""}`}></i>
                <span>{step.title}</span>
              </button>
            )
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeStep === 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Step 1: Database Seed & Schema Configuration
                  </h3>
                  <p className="text-xs text-teal-200/70 mt-0.5">
                    Configure your Postgres/Prisma schema and push migration tables to store indexed product entities.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(codeSnippets.step1, "Step 1 commands")}
                  className="px-3 py-1.5 rounded bg-[#163f47] hover:bg-[#1f5661] text-xs font-medium text-teal-200 hover:text-white border border-[#235862] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <i className="fa-regular fa-copy text-xs"></i>
                  <span>Copy</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#08181b] border border-[#1b4852] font-mono text-xs text-teal-200 overflow-x-auto leading-relaxed">
                <code>{codeSnippets.step1}</code>
              </pre>

              <div className="rounded-xl bg-[#163f47]/40 border border-[#235862] p-3.5 flex items-start gap-3">
                <i className="fa-solid fa-lightbulb text-[#E08E45] text-sm mt-0.5"></i>
                <div className="text-xs text-teal-100/90 leading-relaxed">
                  <span className="font-semibold text-white">Pro Tip:</span> ShopMate integrates directly with existing Shopify, BigCommerce, or custom SQL databases without forcing data schema restructuring.
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Step 2: Index Catalog via REST Endpoint
                  </h3>
                  <p className="text-xs text-teal-200/70 mt-0.5">
                    Send product batches to <code className="text-[#159478]">POST /api/v1/products/sync</code> to generate semantic vector embeddings.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(codeSnippets.step2, "cURL payload")}
                  className="px-3 py-1.5 rounded bg-[#163f47] hover:bg-[#1f5661] text-xs font-medium text-teal-200 hover:text-white border border-[#235862] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <i className="fa-regular fa-copy text-xs"></i>
                  <span>Copy</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#08181b] border border-[#1b4852] font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                <code>{codeSnippets.step2}</code>
              </pre>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e2a30] border border-[#1b4852]">
                <div className="text-xs text-teal-200/80">
                  <span className="font-medium text-white">Live Health Check:</span> Test mock catalog reachability
                </div>
                <button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="px-3 py-1.5 rounded-lg bg-[#159478] hover:bg-[#128168] disabled:opacity-50 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {isVerifying ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                      <span>Pinging...</span>
                    </>
                  ) : isVerified ? (
                    <>
                      <i className="fa-solid fa-check text-xs"></i>
                      <span>Verified (200 OK)</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-satellite-dish text-xs"></i>
                      <span>Ping /api/products</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Step 3: Connect Frontend or AI Agent SDK
                  </h3>
                  <p className="text-xs text-teal-200/70 mt-0.5">
                    Query the search engine with pure natural human language and get ranked results in &lt;150ms.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(codeSnippets.step3, "SDK code snippet")}
                  className="px-3 py-1.5 rounded bg-[#163f47] hover:bg-[#1f5661] text-xs font-medium text-teal-200 hover:text-white border border-[#235862] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <i className="fa-regular fa-copy text-xs"></i>
                  <span>Copy</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#08181b] border border-[#1b4852] font-mono text-xs text-teal-100 overflow-x-auto leading-relaxed">
                <code>{codeSnippets.step3}</code>
              </pre>

              <div className="rounded-xl bg-[#163f47]/40 border border-[#235862] p-3.5 flex items-center justify-between">
                <span className="text-xs text-teal-200">
                  Ready to test a query in real time?
                </span>
                <button
                  onClick={() => {
                    onClose()
                    onOpenSandbox()
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#E08E45] hover:bg-[#c97834] text-xs font-semibold text-white transition-all cursor-pointer shadow-md"
                >
                  Launch Search Sandbox ↗
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0d272c] border-t border-[#1b4852] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-teal-300/70">
            <i className="fa-solid fa-shield-halved text-[#159478]"></i>
            <span>End-to-end encrypted API credentials</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (activeStep < 3) setActiveStep((prev) => (prev + 1) as 1 | 2 | 3)
                else onClose()
              }}
              type="button"
              className="px-4 py-2 rounded-xl bg-[#159478] hover:bg-[#128168] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              {activeStep < 3 ? "Next Step →" : "Done"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
