import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export default async function Home() {
  const session = await getSession()
  if (session.role === 'banker' && session.bankerId) redirect('/banker')
  if (session.role === 'kid' && session.userId) redirect('/account')
  redirect('/login')
}
