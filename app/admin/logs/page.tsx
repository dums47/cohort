export default function AdminLogsPage() {
  return (
    <section className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium text-primary">Super-admin panel</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Request logs</h1>
        <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-medium">Request logging is not configured.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            API request activity will appear here after logging is added.
          </p>
        </div>
      </div>
    </section>
  )
}
