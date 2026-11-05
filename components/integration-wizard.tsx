"use client"

import { X } from "lucide-react"
import { WidgetInstallation } from "@/components/widget-installation"

export function IntegrationWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="integration-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-xl">
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Developer setup</p>
          <h2 id="integration-title" className="mt-1 text-xl font-semibold">Connect your storefront</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close integration setup" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="size-4" /></button>
      </header>
      <WidgetInstallation />
      <footer className="mt-5 flex justify-end">
        <button type="button" onClick={onClose} className="rounded-xl border border-input px-4 py-2 text-sm font-medium">Done</button>
      </footer>
    </section>
  </div>
}
