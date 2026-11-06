import { Activity, Users } from "lucide-react"
import { database } from "@/lib/auth"

export default async function AdminPage() {
  const result = await database.query<{ merchantCount: string }>(
    'SELECT COUNT(*)::text AS "merchantCount" FROM "Merchant"',
  )

  return (
    <section className="flex flex-col gap-6 p-6 md:p-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">ShopMate Control Plane</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">System state</h1>
      </div>
      <article className="max-w-sm rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Merchant accounts</p>
          <Users aria-hidden="true" className="size-4 text-primary" />
        </div>
        <p className="mt-4 text-3xl font-semibold tracking-tight">{result.rows[0].merchantCount}</p>
      </article>
      <article className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <Activity aria-hidden="true" className="size-5 text-muted-foreground" />
          <div>
            <h2 className="font-semibold">Request activity</h2>
            <p className="text-sm text-muted-foreground">
              Request metrics are not available because API request logging is not configured.
            </p>
          </div>
        </div>
      </article>
    </section>
  )
}
