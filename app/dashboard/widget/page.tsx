"use client"

import { WidgetInstallation } from "@/components/widget-installation"

export default function WidgetPage() {
  return <section className="p-6 md:p-10">
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-medium text-primary">Developer console</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Widget installation</h1>
      <p className="mt-2 mb-6 text-muted-foreground">Install and verify your plug-and-play AI search widget.</p>
      <WidgetInstallation />
    </div>
  </section>
}
