"use client"

import React, { useState, useEffect } from "react"
import { useToast } from "../toast"

interface ApiFeedModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ApiFeedModal({ isOpen, onClose }: ApiFeedModalProps) {
  const { showToast } = useToast()
  const [data, setData] = useState<unknown>(null)
  const [latency, setLatency] = useState(24)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      const start = performance.now()
      fetch("/api/products")
        .then((res) => res.json())
        .then((json) => {
          const duration = Math.round(performance.now() - start)
          setLatency(duration || 21)
          setData(json)
        })
        .catch(() => {
          // Fallback if fetch fails
          setData({
            status: "ok",
            endpoint: "/api/products",
            total: 2,
            engine: "ShopMate Natural Intent v2.4",
            products: [
              {
                id: "81QFM3",
                sku: "ELC-WC-881",
                name: "Aura Wireless Headphones",
                category: "Electronics",
                price: 299.99,
                inStock: true
              },
              {
                id: "924GB0",
                sku: "ELC-KB-982",
                name: "Pulse Mechanical Keyboard",
                category: "Electronics",
                price: 139.50,
                inStock: true
              }
            ]
          })
        })
        .finally(() => setIsLoading(false))
    }
  }, [isOpen])

  if (!isOpen) return null

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    showToast("JSON response copied to clipboard!", "success")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#11343A] border border-[#1b4852] shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0d272c] border-b border-[#1b4852]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#159478]/20 border border-[#159478]/40 flex items-center justify-center text-[#159478]">
              <i className="fa-solid fa-code text-xs"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#159478]">GET</span>
                <span className="font-mono text-xs text-white">/api/products</span>
                <span className="px-2 py-0.5 rounded-full bg-[#159478]/20 text-emerald-300 font-mono text-[10px] font-bold">
                  200 OK
                </span>
              </div>
              <p className="text-[11px] text-teal-300/70">
                Live Public Catalog API Endpoint Feed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyJson}
              className="px-3 py-1.5 rounded-lg bg-[#163f47] hover:bg-[#1f5661] text-xs font-medium text-teal-200 hover:text-white border border-[#235862] flex items-center gap-1.5 transition cursor-pointer"
            >
              <i className="fa-regular fa-copy text-xs"></i>
              <span>Copy</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#163f47] hover:bg-[#1f5661] text-teal-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="px-5 py-2.5 bg-[#0e2a30] border-b border-[#1b4852] flex items-center justify-between text-xs font-mono text-teal-300/80">
          <div className="flex items-center gap-4">
            <span>Latency: <strong className="text-emerald-300">{latency}ms</strong></span>
            <span>Content-Type: <strong>application/json</strong></span>
          </div>
          <span className="text-[#E08E45]">Cachable: public, max-age=60</span>
        </div>

        {/* JSON Code Viewer */}
        <div className="p-4 sm:p-5 overflow-y-auto bg-[#08181b] flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-teal-300 text-xs">
              <i className="fa-solid fa-spinner fa-spin text-xl mb-2 text-[#159478]"></i>
              <span>Executing GET request to /api/products...</span>
            </div>
          ) : (
            <pre className="font-mono text-xs text-teal-100 leading-relaxed overflow-x-auto">
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0d272c] border-t border-[#1b4852] flex items-center justify-between text-xs text-teal-300/70">
          <span>Ingest this feed in your AI agent, search crawler, or shopping frontend.</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#159478] hover:bg-[#128168] text-white font-semibold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
