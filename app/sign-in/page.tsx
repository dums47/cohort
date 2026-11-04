"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function SignInPage() {
  const router = useRouter(); const [error, setError] = useState("")
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); const form = new FormData(event.currentTarget); const result = await authClient.signIn.email({ email: String(form.get("email")), password: String(form.get("password")) }); if (result.error) setError("Unable to sign in with those details."); else { router.push("/dashboard"); router.refresh() } }
  return <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground"><form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-border bg-card p-8 shadow-sm"><div><p className="text-sm font-semibold text-primary">Shopmate Console</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome back</h1><p className="mt-2 text-sm text-muted-foreground">Sign in to manage your storefront search.</p></div><label className="flex flex-col gap-2 text-sm font-medium">Email<input name="email" type="email" required className="rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring" /></label><label className="flex flex-col gap-2 text-sm font-medium">Password<input name="password" type="password" required minLength={8} className="rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring" /></label>{error && <p className="text-sm text-destructive">{error}</p>}<button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Sign in</button><p className="text-center text-sm text-muted-foreground">New here? <Link className="font-semibold text-primary" href="/sign-up">Create an account</Link></p></form></main>
}
