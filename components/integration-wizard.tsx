"use client"

import { X } from "lucide-react"
import { WidgetInstallation } from "@/components/widget-installation"

export function IntegrationWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="integration-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 dark:border-[#1b4852] bg-white dark:bg-[#11343A] text-slate-900 dark:text-white p-6 shadow-2xl transition-colors"
      >
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#159478]">Developer setup</p>
            <h2 id="integration-title" className="mt-1 text-xl font-bold">Connect your storefront</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close integration setup"
            className="rounded-lg p-2 text-slate-400 hover:text-slate-600 dark:text-teal-300 dark:hover:text-white cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </header>
        <WidgetInstallation />
        <footer className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#159478] hover:bg-[#128168] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-[#159478]/25 transition cursor-pointer"
          >
            Done
          </button>
        </footer>
      </section>
    </div>
  )
}
