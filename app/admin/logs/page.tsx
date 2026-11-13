export default function AdminLogsPage() {
  return (
    <section className="p-6 md:p-10 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#159478]">Super-admin panel</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Request Logs</h1>
        <div className="mt-8 rounded-2xl border border-slate-200 dark:border-[#1b4852] bg-white dark:bg-[#11343A] p-8 text-center shadow-sm transition-colors">
          <p className="font-bold text-slate-900 dark:text-white text-base">Request logging is not configured.</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-teal-200/70">
            API request activity and live query telemetry will appear here after external logger is attached.
          </p>
        </div>
      </div>
    </section>
  )
}
