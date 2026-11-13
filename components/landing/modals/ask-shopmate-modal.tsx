"use client"

import React, { useState } from "react"
import { useToast } from "../toast"

interface AskShopMateModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenSandbox: () => void
}

interface ChatMessage {
  id: string
  sender: "user" | "shopmate"
  text: string
  suggestedProducts?: {
    name: string
    price: string
    sku: string
    category: string
  }[]
}

export function AskShopMateModal({ isOpen, onClose, onOpenSandbox }: AskShopMateModalProps) {
  const { showToast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "shopmate",
      text: "👋 Hi! I'm ShopMate's conversational AI assistant. You can ask me anything about our products in plain, casual language. What are you looking for today?",
    },
  ])
  const [inputVal, setInputVal] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  if (!isOpen) return null

  const promptStarters = [
    "What's your best wireless headphones with noise cancelling?",
    "Recommend a mechanical keyboard that won't annoy my coworkers",
    "Show me tech gear under $150",
  ]

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal.trim()
    if (!text) return

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputVal("")
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const lower = text.toLowerCase()

      let botReply: ChatMessage = {
        id: Math.random().toString(),
        sender: "shopmate",
        text: "Based on our indexed catalog, here is what matches your requirements best:",
      }

      if (lower.includes("headphone") || lower.includes("noise") || lower.includes("audio")) {
        botReply.text = "I recommend the **Aura Wireless Headphones**! They feature 40-hour battery life and industry-leading active noise cancellation with memory foam cups for all-day comfort."
        botReply.suggestedProducts = [
          {
            name: "Aura Wireless Headphones",
            price: "$299.99",
            sku: "ELC-WC-881",
            category: "Electronics",
          },
        ]
      } else if (lower.includes("keyboard") || lower.includes("coworker") || lower.includes("typing") || lower.includes("switch")) {
        botReply.text = "For quiet productivity, the **Pulse Mechanical Keyboard** is an ideal pick. It uses pre-lubed silent linear switches, hot-swappable sockets, and an anodized aluminum case that dampens typing echo."
        botReply.suggestedProducts = [
          {
            name: "Pulse Mechanical Keyboard",
            price: "$139.50",
            sku: "ELC-KB-982",
            category: "Electronics",
          },
        ]
      } else if (lower.includes("150") || lower.includes("under") || lower.includes("budget") || lower.includes("gear")) {
        botReply.text = "Here are two top-rated gear items under $150 currently in stock with next-day dispatch:"
        botReply.suggestedProducts = [
          {
            name: "Nomad All-Weather Daypack",
            price: "$119.00",
            sku: "ACC-BP-112",
            category: "Accessories",
          },
          {
            name: "Pulse Mechanical Keyboard",
            price: "$139.50",
            sku: "ELC-KB-982",
            category: "Electronics",
          },
        ]
      } else {
        botReply.text = `I parsed your search for "${text}". Our natural language intent model identified relevant matches in the mock catalog:`
        botReply.suggestedProducts = [
          {
            name: "Aura Wireless Headphones",
            price: "$299.99",
            sku: "ELC-WC-881",
            category: "Electronics",
          },
          {
            name: "Pulse Mechanical Keyboard",
            price: "$139.50",
            sku: "ELC-KB-982",
            category: "Electronics",
          },
        ]
      }

      setMessages((prev) => [...prev, botReply])
    }, 700)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#11343A] border border-[#1b4852] shadow-2xl shadow-black overflow-hidden flex flex-col h-[600px] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0d272c] border-b border-[#1b4852]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#6366f1] flex items-center justify-center text-white shadow-md shadow-[#6366f1]/40">
              <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Ask ShopMate</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold border border-purple-500/30">
                  AI Agent
                </span>
              </div>
              <p className="text-[11px] text-teal-300/70">
                Powered by ShopMate Conversational Vector Search
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#163f47] hover:bg-[#1f5661] text-teal-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#159478] text-white rounded-tr-xs"
                    : "bg-[#0e2a30] text-teal-100 border border-[#1b4852] rounded-tl-xs shadow-sm"
                }`}
              >
                {msg.text}
              </div>

              {/* Product recommendations if any */}
              {msg.suggestedProducts && (
                <div className="mt-2 w-full max-w-[85%] space-y-2">
                  {msg.suggestedProducts.map((p) => (
                    <div
                      key={p.sku}
                      onClick={() => {
                        showToast(`Opened ${p.name} details in sandbox!`, "info")
                        onClose()
                        onOpenSandbox()
                      }}
                      className="p-3 rounded-xl bg-[#08181b] border border-[#1b4852] hover:border-[#159478] flex items-center justify-between cursor-pointer transition-colors group"
                    >
                      <div>
                        <div className="text-[10px] font-mono text-teal-400">
                          {p.sku} • {p.category}
                        </div>
                        <div className="text-xs font-bold text-white group-hover:text-teal-200">
                          {p.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#159478]">{p.price}</div>
                        <div className="text-[10px] text-teal-300/60">View In Sandbox →</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#0e2a30] border border-[#1b4852] text-teal-300 text-xs w-24">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}
        </div>

        {/* Starters */}
        <div className="px-4 py-2 bg-[#0e2a30] border-t border-[#1b4852] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-teal-300/60 shrink-0">Prompts:</span>
          {promptStarters.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full bg-[#163f47]/60 hover:bg-[#163f47] text-teal-200 hover:text-white border border-[#235862] whitespace-nowrap cursor-pointer transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3.5 bg-[#0d272c] border-t border-[#1b4852]">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything about products, specs, or compatibility..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#08181b] border border-[#1b4852] text-xs sm:text-sm text-white placeholder-teal-300/40 focus:outline-none focus:border-[#6366f1] transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-500/20"
            >
              <span>Ask</span>
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
