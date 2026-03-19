import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import BankerAccountDetail from './BankerAccountDetail'

export default async function BankerAccountPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (session.role !== 'admin') redirect('/login')

  const accountId = parseInt(params.id)
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      user: true,
      transactions: { orderBy: { date: 'desc' } },
    },
  })

  if (!account) redirect('/banker')

  const settings = await prisma.settings.findUnique({ where: { id: 1 } })

  return (
    <BankerAccountDetail
      account={{
        id: account.id,
        userId: account.userId,
        username: account.user.username,
        colorTheme: account.user.colorTheme,
        currentBalance: account.currentBalance,
        transactions: account.transactions.map((t) => ({
          id: t.id,
          date: t.date.toISOString(),
          amount: t.amount,
          type: t.type,
          description: t.description,
          createdAt: t.createdAt.toISOString(),
        })),
      }}
      annualInterestRate={settings?.annualInterestRate ?? 0.05}
    />
  )
}
