import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import BankerDashboard from './BankerDashboard'

export default async function BankerPage() {
  const session = await getSession()
  if (session.role !== 'banker' || !session.bankerId) redirect('/login')

  const accounts = await prisma.account.findMany({
    where: { user: { bankerId: session.bankerId } },
    include: {
      user: true,
      transactions: { orderBy: { date: 'desc' }, take: 1 },
    },
    orderBy: { user: { username: 'asc' } },
  })

  const settings = await prisma.bankerSettings.findUnique({ where: { bankerId: session.bankerId } })

  const data = accounts.map((a) => ({
    id: a.id,
    userId: a.userId,
    name: a.user.name,
    username: a.user.username,
    colorTheme: a.user.colorTheme,
    currentBalance: a.currentBalance,
    lastTransactionDate: a.transactions[0]?.date?.toISOString() ?? null,
  }))

  return (
    <BankerDashboard
      accounts={data}
      annualInterestRate={settings?.annualInterestRate ?? 0.05}
      bankName={session.bankName ?? 'Your Bank'}
    />
  )
}
