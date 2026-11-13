"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

interface Toast {
  id: string
  message: string
  type?: "success" | "info" | "warning"
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "info" | "warning") => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              toast.type === "success"
                ? "bg-[#11343a]/95 text-emerald-300 border-[#159478]/50 shadow-[#159478]/10"
                : toast.type === "warning"
                ? "bg-[#11343a]/95 text-amber-300 border-[#E08E45]/50 shadow-[#E08E45]/10"
                : "bg-[#11343a]/95 text-teal-200 border-teal-500/30"
            }`}
          >
            <i
              className={`fa-solid ${
                toast.type === "success"
                  ? "fa-circle-check text-[#159478]"
                  : toast.type === "warning"
                  ? "fa-triangle-exclamation text-[#E08E45]"
                  : "fa-circle-info text-teal-400"
              }`}
            />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
