"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setStatus("")
    setIsSubmitting(true)

    try {
      const form = new FormData(event.currentTarget)
      const result = await authClient.signIn.email({
        email: String(form.get("email")).trim(),
        password: String(form.get("password")),
      })

      if (result.error) {
        setError("Unable to sign in. Check your email and password and try again.")
        return
      }

      setStatus("Signed in successfully. Redirecting...")
      router.replace("/dashboard")
      router.refresh()
    } catch {
      setError("Unable to sign in right now. Check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <form onSubmit={submit} aria-busy={isSubmitting} className="flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-primary">Naturalsearch Console</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your storefront search.</p>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Email
          <input name="email" type="email" autoComplete="email" required disabled={isSubmitting} className="rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Password
          <input name="password" type="password" autoComplete="current-password" required minLength={8} disabled={isSubmitting} className="rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring" />
        </label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {status && <p role="status" className="text-sm text-emerald-600">{status}</p>}
        <button type="submit" disabled={isSubmitting} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-center text-sm text-muted-foreground">New here? <Link className="font-semibold text-primary" href="/sign-up">Create an account</Link></p>
      </form>
    </main>
  )
}
