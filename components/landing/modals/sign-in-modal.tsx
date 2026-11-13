"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { useToast } from "../toast"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp: () => void
}

export function SignInModal({ isOpen, onClose, onSwitchToSignUp }: SignInModalProps) {
  const router = useRouter()
  const { showToast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password) {
      showToast("Please enter both email and password.", "warning")
      return
    }

    setIsLoading(true)
    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe,
      })

      if (result.error) {
        showToast(result.error.message || "Unable to sign in. Check your credentials and try again.", "warning")
        return
      }

      showToast("Signed in successfully. Redirecting to Merchant Console...", "success")
      onClose()
      router.replace("/dashboard")
      router.refresh()
    } catch {
      showToast("Unable to sign in right now. Please try again.", "warning")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#11343A] border border-[#1b4852] shadow-2xl shadow-black p-6 sm:p-8 flex flex-col"
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
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#159478] flex items-center justify-center text-white shadow-sm">
              <i className="fa-solid fa-magnifying-glass text-xs"></i>
            </div>
            <span className="font-serif font-bold text-xl text-white">ShopMate</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign In</h2>
          <p className="text-xs text-teal-200/70 mt-1">
            Access your search telemetry, API keys, and store indexing.
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-teal-200 mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <i className="fa-regular fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-teal-400/60 text-xs"></i>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@company.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#08181b] border border-[#1b4852] text-sm text-white placeholder-teal-400/30 focus:outline-none focus:border-[#159478] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-teal-200">
                Password
              </label>
            </div>

            <div className="relative">
              <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-teal-400/60 text-xs"></i>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#08181b] border border-[#1b4852] text-sm text-white placeholder-teal-400/30 focus:outline-none focus:border-[#159478] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-400/60 hover:text-teal-200 transition-colors cursor-pointer"
              >
                <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-[#159478] w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-teal-200/80">Remember this machine for 30 days</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#159478] hover:bg-[#128168] disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-[#159478]/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Console</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </>
            )}
          </button>
        </form>

        {/* Switch to Sign Up */}
        <div className="mt-6 pt-5 border-t border-[#1b4852] flex flex-col gap-2 text-center text-xs text-teal-200/70">
          <div>
            Don&apos;t have an account yet?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-[#159478] hover:text-teal-300 font-semibold transition-colors cursor-pointer"
            >
              Create an API Account
            </button>
          </div>
          <div>
            Prefer full page?{" "}
            <Link
              href="/sign-in"
              className="text-teal-300 hover:text-white underline transition-colors"
            >
              Open dedicated Sign In page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
