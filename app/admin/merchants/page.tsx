import { database } from "@/lib/auth"

type MerchantRow = {
  id: string
  name: string
  email: string
  plan: string
  createdAt: Date
  apiKeyCount: number
}

export default async function AdminMerchantsPage() {
  const result = await database.query<MerchantRow>(
    `SELECT m.id, m.name, m.email, m.plan, m."createdAt",
            COUNT(k.id)::int AS "apiKeyCount"
     FROM "Merchant" m
     LEFT JOIN "ApiKey" k ON k."merchantId" = m.id AND k."isActive" = TRUE
     GROUP BY m.id
     ORDER BY m."createdAt" DESC`,
  )

  return (
    <section className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium text-primary">Super-admin panel</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Merchants</h1>
        <p className="mt-2 text-muted-foreground">Merchant accounts registered in the database.</p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                {["Merchant", "Email", "Plan", "Active API keys", "Created"].map((heading) => (
                  <th key={heading} className="px-5 py-4 font-medium">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((merchant) => (
                <tr key={merchant.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4 font-medium">{merchant.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{merchant.email}</td>
                  <td className="px-5 py-4 capitalize">{merchant.plan}</td>
                  <td className="px-5 py-4">{merchant.apiKeyCount}</td>
                  <td className="px-5 py-4 text-muted-foreground">{merchant.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
              {result.rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                    No merchant accounts have been created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
