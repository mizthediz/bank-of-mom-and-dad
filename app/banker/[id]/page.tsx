import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import BankerAccountDetail from './BankerAccountDetail'

export default async function BankerAccountPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (session.role !== 'banker' || !session.bankerId) redirect('/login')

  const accountId = parseInt(params.id)
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      user: true,
      transactions: { orderBy: { date: 'desc' } },
    },
  })

  // Ensure the account belongs to this banker
  if (!account || account.user.bankerId !== session.bankerId) redirect('/banker')

  const settings = await prisma.bankerSettings.findUnique({ where: { bankerId: session.bankerId } })

  return (
    <BankerAccountDetail
      account={{
        id: account.id,
        userId: account.userId,
        name: account.user.name,
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
