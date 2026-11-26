import { cookies } from 'next/headers'

// Shared-secret cookie auth for the solo-operator admin (scoped for a
// pre-revenue directory — no user accounts until real demand exists).
const COOKIE = 'ld_admin_token'

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE)?.value
  const expected = process.env.ADMIN_TOKEN
  if (!expected) return false
  return token === expected
}

export async function assertAdmin() {
  if (!(await isAdmin())) {
    const { redirect } = await import('next/navigation')
    redirect('/admin')
  }
}
