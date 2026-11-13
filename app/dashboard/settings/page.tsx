import { headers } from "next/headers"
import { auth, database } from "@/lib/auth"

type StoreProfile = {
  name: string
  email: string
  brandName: string | null
  primaryColor: string | null
  widgetPosition: string | null
}

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const result = await database.query<StoreProfile>(
    `SELECT m.name, m.email, s."brandName", s."primaryColor", s."widgetPosition"
     FROM "Merchant" m
     LEFT JOIN "StoreConfig" s ON s."merchantId" = m.id
     WHERE LOWER(m.email) = LOWER($1)
     LIMIT 1`,
    [session?.user.email ?? ""],
  )
  const profile = result.rows[0]

  return (
    <section className="p-6 md:p-10 transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#159478]">
          Merchant portal
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Store Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-teal-200/70">
          Review your account profile and storefront integration configurations.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <article className="rounded-2xl border border-slate-200 dark:border-[#1b4852] bg-white dark:bg-[#11343A] p-6 shadow-sm transition-colors">
            <h2 className="font-bold text-slate-900 dark:text-white text-base">
              Store Profile
            </h2>
            {profile ? (
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1b4852]/60">
                  <dt className="text-slate-500 dark:text-teal-200/70">Merchant Name</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{profile.name}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1b4852]/60">
                  <dt className="text-slate-500 dark:text-teal-200/70">Account Email</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{profile.email}</dd>
                </div>
                {profile.brandName && (
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1b4852]/60">
                    <dt className="text-slate-500 dark:text-teal-200/70">Widget Brand</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">{profile.brandName}</dd>
                  </div>
                )}
                {profile.primaryColor && (
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1b4852]/60">
                    <dt className="text-slate-500 dark:text-teal-200/70">Theme Color</dt>
                    <dd className="font-mono text-xs text-[#159478]">{profile.primaryColor}</dd>
                  </div>
                )}
                {profile.widgetPosition && (
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-500 dark:text-teal-200/70">Widget Position</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">{profile.widgetPosition}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-slate-500 dark:text-teal-200/70">
                No store profile has been created yet. Set up an integration to create one.
              </p>
            )}
          </article>

          {/* Catalog Sync Card */}
          <article className="rounded-2xl border border-slate-200 dark:border-[#1b4852] bg-white dark:bg-[#11343A] p-6 shadow-sm transition-colors">
            <h2 className="font-bold text-slate-900 dark:text-white text-base">
              Catalog Sync Status
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-teal-200/70 leading-relaxed">
              External crawlers or local sync scripts can ingest products using <code className="font-mono text-xs text-[#159478] bg-slate-100 dark:bg-[#08181b] px-1.5 py-0.5 rounded">POST /api/v1/products/sync</code>.
            </p>
            <div className="mt-5 p-3.5 rounded-xl bg-slate-50 dark:bg-[#08181b] border border-slate-200 dark:border-[#1b4852] text-xs font-mono text-slate-700 dark:text-teal-200">
              <span className="text-[#159478] font-bold">Engine:</span> ShopMate Meilisearch v2.4 (Active)
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
