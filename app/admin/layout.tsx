import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { canAccessAdmin } from "@/lib/admin-access"
import { PortalShell } from "@/components/portal-shell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/login")
  if (!canAccessAdmin(session.user.email)) redirect("/dashboard")
  return <PortalShell admin>{children}</PortalShell>
}
