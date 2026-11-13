"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setStatus("")
    setIsSubmitting(true)

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password: password,
        rememberMe,
      })

      if (result.error) {
        // If credentials are not in better-auth DB, offer instant demo bypass to console
        setError(result.error.message || "Invalid credentials. You can click 'Fill Demo Credentials' to test with demo account.")
        return
      }

      setStatus("Signed in successfully! Redirecting to Merchant Console...")
      setTimeout(() => {
        router.replace("/dashboard")
        router.refresh()
      }, 700)
    } catch {
      setError("Unable to sign in right now. Please try again.")
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
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-teal-300 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-[11px]"></i>
          <span>Back to ShopMate Home</span>
        </Link>
        <span className="text-[10px] font-mono text-teal-300/50 uppercase">API v2.4</span>
      </div>

      {/* Sign In Card */}
      <div className="w-full max-w-md rounded-2xl bg-[#11343A] border border-[#1b4852] shadow-2xl shadow-black/80 p-6 sm:p-8 flex flex-col relative z-10">
        {/* Brand Header */}
        <div className="mb-6">
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign In to Console</h1>
          <p className="text-xs text-teal-200/70 mt-1">
            Access your search telemetry, catalog index keys, and live store logs.
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-teal-200 mb-1.5">
              Work Email
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
                placeholder="developer@company.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#08181b] border border-[#1b4852] text-sm text-white placeholder-teal-400/30 focus:outline-none focus:border-[#159478] transition-colors"
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
              <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400/60 text-xs"></i>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-teal-200/80">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-[#159478] w-4 h-4 cursor-pointer"
              />
              <span>Remember me for 30 days</span>
            </label>
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#159478] hover:bg-[#128168] disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-[#159478]/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            {isSubmitting ? (
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
        <div className="mt-6 pt-5 border-t border-[#1b4852] text-center text-xs text-teal-200/70">
          Need an API key?{" "}
          <Link
            href="/sign-up"
            className="text-[#159478] hover:text-teal-300 font-semibold transition-colors"
          >
            Create an API Account
          </Link>
        </div>
      </div>
    </main>
  )
}
