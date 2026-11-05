import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { canAccessAdmin } from "@/lib/admin-access"
import { PortalShell } from "@/components/portal-shell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/login")
  return <PortalShell canAccessAdmin={canAccessAdmin(session.user.email)}>{children}</PortalShell>
}
