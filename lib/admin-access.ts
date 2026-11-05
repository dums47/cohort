export function canAccessAdmin(email: string | null | undefined) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  return Boolean(adminEmail && email?.trim().toLowerCase() === adminEmail)
}
