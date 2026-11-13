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
    <section className="p-6 md:p-10 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#159478]">Super-admin panel</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Merchants</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-teal-200/70">Merchant accounts registered in the database.</p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#1b4852] bg-white dark:bg-[#11343A] shadow-sm transition-colors">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-[#1b4852] bg-slate-50 dark:bg-[#0e2a30] text-slate-600 dark:text-teal-200 text-xs font-semibold">
              <tr>
                {["Merchant", "Email", "Plan", "Active API keys", "Created"].map((heading) => (
                  <th key={heading} className="px-5 py-4">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1b4852]/60">
              {result.rows.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-slate-50/50 dark:hover:bg-[#163f47]/50 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">{merchant.name}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-teal-200/80">{merchant.email}</td>
                  <td className="px-5 py-4">
                    <span className="capitalize px-2 py-0.5 rounded-full text-xs font-semibold bg-[#159478]/15 text-[#159478] border border-[#159478]/30">
                      {merchant.plan}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-700 dark:text-teal-100">{merchant.apiKeyCount}</td>
                  <td className="px-5 py-4 text-slate-500 dark:text-teal-300/60">{merchant.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
              {result.rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500 dark:text-teal-200/70">
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
