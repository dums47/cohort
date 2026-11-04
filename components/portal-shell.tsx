"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

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

export function PortalShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const pathname = usePathname()
  const nav = admin ? adminNav : merchantNav
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card/80 p-5 backdrop-blur lg:block">
        <Link href={admin ? "/admin" : "/dashboard"} className="flex items-center gap-3 text-lg font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-primary font-mono text-sm text-primary-foreground">S</span>
          Shopmate <span className="text-xs text-muted-foreground">{admin ? "admin" : "merchant"}</span>
        </Link>
        <nav className="mt-12 flex flex-col gap-2" aria-label={admin ? "Admin navigation" : "Merchant navigation"}>
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className={cn("rounded-xl px-3 py-2.5 text-sm transition-colors", pathname === href ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">v1.0.0</span>
          <ThemeToggle />
        </div>
      </aside>
      <main className="min-h-screen lg:pl-64">{children}</main>
    </div>
  )
}
