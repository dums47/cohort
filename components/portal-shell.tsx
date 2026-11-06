"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

const merchantNav = [
  ["Overview", "/dashboard"],
  ["API keys", "/dashboard/keys"],
  ["Widget studio", "/dashboard/widget"],
  ["Settings", "/dashboard/settings"],
]

const adminNav = [
  ["System state", "/admin"],
  ["Request logs", "/admin/logs"],
  ["Merchants", "/admin/merchants"],
]

export function PortalShell({ children, admin = false, canAccessAdmin = false }: { children: React.ReactNode; admin?: boolean; canAccessAdmin?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const [logoutError, setLogoutError] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const nav = admin ? adminNav : canAccessAdmin ? [...merchantNav, ["System admin", "/admin"]] : merchantNav

  async function logout() {
    setLogoutError("")
    setIsLoggingOut(true)

    try {
      const result = await authClient.signOut()
      if (result.error) {
        setLogoutError("Unable to log out. Please try again.")
        return
      }

      router.replace("/login")
      router.refresh()
    } catch {
      setLogoutError("Unable to log out. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card/80 p-5 backdrop-blur lg:block">
        <Link href={admin ? "/admin" : "/dashboard"} className="flex items-center gap-3 text-lg font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-primary font-mono text-sm text-primary-foreground">S</span>
          ShopMate <span className="text-xs text-muted-foreground">{admin ? "admin" : "merchant"}</span>
        </Link>
        <nav className="mt-12 flex flex-col gap-2" aria-label={admin ? "Admin navigation" : "Merchant navigation"}>
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className={cn("rounded-xl px-3 py-2.5 text-sm transition-colors", pathname === href ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 space-y-3 border-t border-border pt-4">
          {logoutError && <p role="alert" className="text-xs text-destructive">{logoutError}</p>}
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={logout}
            disabled={isLoggingOut}
          >
            <LogOut aria-hidden="true" />
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">v1.0.0</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>
      <header className="flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 lg:hidden">
        <Link href={admin ? "/admin" : "/dashboard"} className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-primary font-mono text-sm text-primary-foreground">S</span>
          ShopMate
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={logout}
          disabled={isLoggingOut}
        >
          <LogOut aria-hidden="true" />
          {isLoggingOut ? "Logging out..." : "Log out"}
        </Button>
      </header>
      {logoutError && <p role="alert" className="px-4 py-2 text-sm text-destructive lg:hidden">{logoutError}</p>}
      <main className="min-h-screen lg:pl-64">{children}</main>
    </div>
  )
}
