"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, ArrowLeft, LayoutDashboard, KeyRound, Palette, Settings, ShieldAlert, FileText, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

const merchantNav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "API keys", href: "/dashboard/keys", icon: KeyRound },
  { label: "Widget studio", href: "/dashboard/widget", icon: Palette },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

const adminNav = [
  { label: "System state", href: "/admin", icon: ShieldAlert },
  { label: "Request logs", href: "/admin/logs", icon: FileText },
  { label: "Merchants", href: "/admin/merchants", icon: Users },
]

export function PortalShell({
  children,
  admin = false,
  canAccessAdmin = false,
}: {
  children: React.ReactNode
  admin?: boolean
  canAccessAdmin?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [logoutError, setLogoutError] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const nav = admin
    ? adminNav
    : canAccessAdmin
    ? [...merchantNav, { label: "System admin", href: "/admin", icon: ShieldAlert }]
    : merchantNav

  async function logout() {
    setLogoutError("")
    setIsLoggingOut(true)

    try {
      const result = await authClient.signOut()
      if (result.error) {
        setLogoutError("Unable to log out. Please try again.")
        return
      }

      router.replace("/sign-in")
      router.refresh()
    } catch {
      setLogoutError("Unable to log out. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07171a] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Sidebar - Desktop: Deep teal matching landing page navbar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#1b4852] bg-[#0d272c] p-5 lg:flex lg:flex-col justify-between z-30 shadow-xl">
        <div>
          {/* Brand header */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="ShopMate Home"
          >
            <div className="w-9 h-9 rounded-full bg-[#159478] flex items-center justify-center text-white shadow-md shadow-[#159478]/30 group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-white leading-none">
                ShopMate
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-teal-300/80 uppercase mt-0.5">
                {admin ? "Control Plane" : "Merchant Console"}
              </span>
            </div>
          </Link>

          {/* Back to landing page link */}
          <div className="mt-6 mb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-teal-300/80 hover:text-white px-3 py-2 rounded-xl hover:bg-[#163f47] transition-all w-full"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Landing Page</span>
            </Link>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-1.5" aria-label={admin ? "Admin navigation" : "Merchant navigation"}>
            {nav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#159478] text-white shadow-md shadow-[#159478]/30 font-semibold"
                      : "text-teal-100/70 hover:bg-[#163f47] hover:text-white"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 border-t border-[#1b4852] pt-4">
          {logoutError && (
            <p role="alert" className="text-xs text-rose-400">
              {logoutError}
            </p>
          )}

          <button
            type="button"
            onClick={logout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium text-teal-200/70 hover:bg-[#163f47] hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <LogOut className="size-4" />
            <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
          </button>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-teal-300/50">ShopMate v2.4</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Header - Mobile: Deep teal matching landing page navbar */}
      <header className="flex items-center justify-between border-b border-[#1b4852] bg-[#0d272c] px-4 py-3 lg:hidden text-white sticky top-0 z-30 shadow-md">
        <Link href={admin ? "/admin" : "/dashboard"} className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="w-8 h-8 rounded-full bg-[#159478] flex items-center justify-center text-white">
            <i className="fa-solid fa-magnifying-glass text-xs"></i>
          </div>
          <span className="font-serif font-bold text-lg">ShopMate</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={logout}
            disabled={isLoggingOut}
            className="text-teal-200 hover:text-white hover:bg-[#163f47]"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>

      {logoutError && (
        <p role="alert" className="px-4 py-2 text-sm text-rose-500 lg:hidden">
          {logoutError}
        </p>
      )}

      {/* Main Content Area - White in light mode, Dark in dark mode */}
      <main className="min-h-screen lg:pl-64 transition-colors duration-300">
        {children}
      </main>
    </div>
  )
}
