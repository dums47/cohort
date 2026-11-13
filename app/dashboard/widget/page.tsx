"use client"

import { WidgetInstallation } from "@/components/widget-installation"

export default function WidgetPage() {
  return (
    <section className="p-6 md:p-10 transition-colors duration-300">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#159478]">
          Developer console
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Widget Installation
        </h1>
        <p className="mt-1 mb-8 text-sm text-slate-500 dark:text-teal-200/70">
          Install and verify your plug-and-play AI search widget on any storefront.
        </p>
        <WidgetInstallation />
      </div>
    </section>
  )
}
