import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { prisma } from '@/lib/db'
import { SessionData, sessionOptions } from '@/lib/session'

export default async function RootPage() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

  if (session.role === 'admin') redirect('/banker')
  if (session.role === 'customer') redirect('/account')

  const settings = await prisma.settings.findUnique({ where: { id: 1 } })
  if (!settings?.adminPasswordHash) {
    redirect('/setup')
  }
  redirect('/login')
}
