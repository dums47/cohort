"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setDark(isDark)
  }, [])

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    document.documentElement.classList.toggle("light", !next)
    localStorage.setItem("theme", next ? "dark" : "light")
    setDark(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center gap-1.5 rounded-xl bg-[#163f47] border border-[#235862] hover:bg-[#1b4e57] px-2.5 py-1.5 text-xs font-medium text-teal-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
    >
      {dark ? <Sun className="size-3.5 text-[#E08E45]" /> : <Moon className="size-3.5 text-teal-300" />}
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  )
}
