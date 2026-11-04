"use client"

import { useEffect } from "react"

export function ThemeBootstrap() {
  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const dark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.classList.toggle("light", !dark)
  }, [])
  return null
}
