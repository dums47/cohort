import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { PortalShell } from "@/components/portal-shell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  const adminEmail = process.env.ADMIN_EMAIL
  if (!session?.user) redirect("/login")
  if (!adminEmail || session.user.email !== adminEmail) redirect("/dashboard")
  return <PortalShell admin>{children}</PortalShell>
}
