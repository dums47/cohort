"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { useToast } from "../toast"

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignIn: () => void
}

export function SignUpModal({ isOpen, onClose, onSwitchToSignIn }: SignUpModalProps) {
  const router = useRouter()
  const { showToast } = useToast()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [storeUrl, setStoreUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!fullName || !email || !password) {
      showToast("Please complete all required fields.", "warning")
      return
    }

    setIsLoading(true)
    try {
      const result = await authClient.signUp.email({
        name: fullName.trim(),
        email: email.trim(),
        password,
      })

      if (result.error) {
        showToast(result.error.message || "Unable to create your account. Please try again.", "warning")
        return
      }

      showToast(`Welcome to ShopMate, ${fullName}!`, "success")
      onClose()
      router.replace("/dashboard")
      router.refresh()
    } catch {
      showToast("Unable to create your account right now. Please try again.", "warning")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#11343A] border border-[#1b4852] shadow-2xl shadow-black p-6 sm:p-8 flex flex-col max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#163f47] hover:bg-[#1f5661] text-teal-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>

        {/* Brand Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#159478] flex items-center justify-center text-white shadow-sm">
              <i className="fa-solid fa-magnifying-glass text-xs"></i>
            </div>
            <span className="font-serif font-bold text-xl text-white">ShopMate</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-[#159478]/20 border border-[#159478]/40 text-[10px] font-semibold text-emerald-300">
              Developer Free Tier
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create API Account</h2>
          <p className="text-xs text-teal-200/70 mt-1">
            Get instant access to AI product search, 10,000 free queries/mo, and zero credit card required.
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-teal-200 mb-1">
              Developer / Merchant Name *
            </label>
            <div className="relative">
              <i className="fa-regular fa-user absolute left-3 top-1/2 -translate-y-1/2 text-teal-400/60 text-xs"></i>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#08181b] border border-[#1b4852] text-sm text-white placeholder-teal-400/30 focus:outline-none focus:border-[#159478] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-teal-200 mb-1">
              Work Email *
            </label>
            <div className="relative">
              <i className="fa-regular fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-teal-400/60 text-xs"></i>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@acmecommerce.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#08181b] border border-[#1b4852] text-sm text-white placeholder-teal-400/30 focus:outline-none focus:border-[#159478] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-teal-200 mb-1">
              Storefront Domain or Webhook URL (Optional)
            </label>
            <div className="relative">
              <i className="fa-solid fa-globe absolute left-3 top-1/2 -translate-y-1/2 text-teal-400/60 text-xs"></i>
              <input
                type="text"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                placeholder="https://store.acme.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#08181b] border border-[#1b4852] text-sm text-white placeholder-teal-400/30 focus:outline-none focus:border-[#159478] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-teal-200 mb-1">
              Password *
            </label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-teal-400/60 text-xs"></i>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#08181b] border border-[#1b4852] text-sm text-white placeholder-teal-400/30 focus:outline-none focus:border-[#159478] transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#159478] hover:bg-[#128168] disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-[#159478]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                  <span>Registering Developer Account...</span>
                </>
              ) : (
                <>
                  <span>Create Developer Account</span>
                  <i className="fa-solid fa-bolt text-xs"></i>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Switch to Sign In */}
        <div className="mt-5 pt-4 border-t border-[#1b4852] flex flex-col gap-2 text-center text-xs text-teal-200/70">
          <div>
            Already have a developer token?{" "}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-[#159478] hover:text-teal-300 font-semibold transition-colors cursor-pointer"
            >
              Sign in to existing account
            </button>
          </div>
          <div>
            Prefer full page?{" "}
            <Link
              href="/sign-up"
              className="text-teal-300 hover:text-white underline transition-colors"
            >
              Open dedicated Registration page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
