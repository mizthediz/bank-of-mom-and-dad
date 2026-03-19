import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export default async function RootPage() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } })
  if (!settings?.adminPasswordHash) {
    redirect('/setup')
  }
  redirect('/login')
}
