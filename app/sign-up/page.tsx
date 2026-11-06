"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setStatus("")
    setIsSubmitting(true)

    try {
      const form = new FormData(event.currentTarget)
      const result = await authClient.signUp.email({
        name: String(form.get("name")).trim(),
        email: String(form.get("email")).trim(),
        password: String(form.get("password")),
      })

      if (result.error) {
        setError(result.error.message || "Unable to create your account. Check your details and try again.")
        return
      }

      setIsComplete(true)
      setStatus("Account created successfully. Redirecting...")
      window.setTimeout(() => {
        router.replace("/dashboard")
        router.refresh()
      }, 1200)
    } catch {
      setError("Unable to create your account right now. Check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <form onSubmit={submit} aria-busy={isSubmitting} className="flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-primary">ShopMate Console</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Start powering better product discovery.</p>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Name
          <input name="name" autoComplete="name" required disabled={isSubmitting || isComplete} className="rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Email
          <input name="email" type="email" autoComplete="email" required disabled={isSubmitting || isComplete} className="rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Password
          <input name="password" type="password" autoComplete="new-password" required minLength={8} disabled={isSubmitting || isComplete} className="rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring" />
        </label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {status && <p role="status" className="text-sm text-emerald-600">{status}</p>}
        <button type="submit" disabled={isSubmitting || isComplete} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Creating account..." : isComplete ? "Account created" : "Create account"}
        </button>
        <p className="text-center text-sm text-muted-foreground">Already have an account? <Link className="font-semibold text-primary" href="/sign-in">Sign in</Link></p>
      </form>
    </main>
  )
}
