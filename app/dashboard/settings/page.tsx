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
    <section className="p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-primary">Merchant portal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Store settings</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold">Store profile</h2>
            {profile ? (
              <dl className="mt-4 space-y-3 text-sm">
                <div><dt className="text-muted-foreground">Name</dt><dd>{profile.name}</dd></div>
                <div><dt className="text-muted-foreground">Email</dt><dd>{profile.email}</dd></div>
                {profile.brandName && <div><dt className="text-muted-foreground">Widget brand</dt><dd>{profile.brandName}</dd></div>}
                {profile.primaryColor && <div><dt className="text-muted-foreground">Widget color</dt><dd>{profile.primaryColor}</dd></div>}
                {profile.widgetPosition && <div><dt className="text-muted-foreground">Widget position</dt><dd>{profile.widgetPosition}</dd></div>}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No store profile has been created yet. Set up an integration to create one.
              </p>
            )}
          </article>
          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold">Catalog sync</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Sync history and connection status are not currently tracked.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
