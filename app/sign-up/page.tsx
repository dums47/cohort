"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [storeUrl, setStoreUrl] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setStatus("")
    setIsSubmitting(true)

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password: password,
      })

      if (result.error) {
        // If DB duplicate or error, report or simulate demo registration
        setError(result.error.message || "Unable to register this account. Please try another email or sign in.")
        return
      }

      setStatus(`Account created successfully for ${name}! Redirecting to console...`)
      setTimeout(() => {
        router.replace("/dashboard")
        router.refresh()
      }, 900)
    } catch {
      setError("Unable to create your account right now. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0d272c] text-white flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-[#159478] selection:text-white">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-[#159478]/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-[#E08E45]/8 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      {/* Back to Home Button */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-teal-300 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-[11px]"></i>
          <span>Back to ShopMate Home</span>
        </Link>
        <span className="text-[10px] font-mono text-teal-300/50 uppercase">Free Developer Tier</span>
      </div>

      {/* Sign Up Card */}
      <div className="w-full max-w-lg rounded-2xl bg-[#11343A] border border-[#1b4852] shadow-2xl shadow-black/80 p-6 sm:p-8 flex flex-col relative z-10">
        {/* Brand Header */}
        <div className="mb-5">
          <Link href="/" className="flex items-center gap-2.5 mb-3 group focus:outline-none">
            <div className="w-9 h-9 rounded-full bg-[#159478] flex items-center justify-center text-white shadow-md shadow-[#159478]/30 group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-2xl text-white tracking-tight leading-none">
                ShopMate
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-[#159478] uppercase mt-0.5">
                SEARCH API
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Create API Account</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#159478]/20 border border-[#159478]/40 text-[10px] font-semibold text-emerald-300">
              10k Free Queries
            </span>
          </div>
          <p className="text-xs text-teal-200/70 mt-1">
            Start powering sub-150ms natural language product discovery for your store.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={submit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-teal-200 mb-1">
              Developer / Merchant Name *
            </label>
            <div className="relative">
              <i className="fa-regular fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400/60 text-xs"></i>
              <input
                name="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#08181b] border border-[#1b4852] text-sm text-white placeholder-teal-400/30 focus:outline-none focus:border-[#159478] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-teal-200 mb-1">
              Work Email *
            </label>
            <div className="relative">
              <i className="fa-regular fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400/60 text-xs"></i>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@acmecommerce.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#08181b] border border-[#1b4852] text-sm text-white placeholder-teal-400/30 focus:outline-none focus:border-[#159478] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-teal-200 mb-1">
              Storefront Domain or Webhook URL (Optional)
            </label>
            <div className="relative">
              <i className="fa-solid fa-globe absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400/60 text-xs"></i>
              <input
                name="storeUrl"
                type="text"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                placeholder="https://store.acme.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#08181b] border border-[#1b4852] text-sm text-white placeholder-teal-400/30 focus:outline-none focus:border-[#159478] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-teal-200 mb-1">
              Password *
            </label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400/60 text-xs"></i>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#08181b] border border-[#1b4852] text-sm text-white placeholder-teal-400/30 focus:outline-none focus:border-[#159478] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-teal-400/60 hover:text-teal-200 transition-colors cursor-pointer"
              >
                <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          {status && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <i className="fa-solid fa-circle-check shrink-0"></i>
              <span>{status}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#159478] hover:bg-[#128168] disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-[#159478]/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              {isSubmitting ? (
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
        <div className="mt-5 pt-4 border-t border-[#1b4852] text-center text-xs text-teal-200/70">
          Already registered?{" "}
          <Link
            href="/sign-in"
            className="text-[#159478] hover:text-teal-300 font-semibold transition-colors"
          >
            Sign in to existing account
          </Link>
        </div>
      </div>
    </main>
  )
}
