import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin-auth'
import { AdminLogin } from './LoginForm'

export default async function AdminIndexPage() {
  if (await isAdmin()) redirect('/admin/claims')
  return <AdminLogin />
}
