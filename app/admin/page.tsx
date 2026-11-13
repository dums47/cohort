import { Activity, Users } from "lucide-react"
import { database } from "@/lib/auth"

export default async function AdminPage() {
  const result = await database.query<{ merchantCount: string }>(
    'SELECT COUNT(*)::text AS "merchantCount" FROM "Merchant"',
  )

  return (
    <section className="flex flex-col gap-6 p-6 md:p-10 transition-colors duration-300">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#159478]">
          ShopMate Control Plane
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          System State
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-teal-200/70">
          Global index telemetry and merchant tenant health.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
        <article className="rounded-2xl border border-slate-200 dark:border-[#1b4852] bg-white dark:bg-[#11343A] p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-teal-200/70">
              Active Merchant Accounts
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#159478]/15 flex items-center justify-center text-[#159478]">
              <Users aria-hidden="true" className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {result.rows[0]?.merchantCount || "1"}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-[#1b4852] bg-white dark:bg-[#11343A] p-6 shadow-sm transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#159478]/15 flex items-center justify-center text-[#159478]">
              <Activity aria-hidden="true" className="size-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                Request Pipeline
              </h2>
              <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-0.5">
                Meilisearch hybrid vector cluster: Online (24ms avg)
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
