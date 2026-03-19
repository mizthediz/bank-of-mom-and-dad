import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { getRandomTip } from '@/lib/tips'
import CustomerAccount from './CustomerAccount'

export default async function AccountPage() {
  const session = await getSession()
  if (session.role !== 'customer' || !session.userId) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      account: {
        include: { transactions: { orderBy: { date: 'desc' } } },
      },
    },
  })

  if (!user?.account) redirect('/login')

  const tip = getRandomTip()

  return (
    <CustomerAccount
      account={{
        id: user.account.id,
        username: user.username,
        colorTheme: user.colorTheme,
        currentBalance: user.account.currentBalance,
        transactions: user.account.transactions.map((t) => ({
          id: t.id,
          date: t.date.toISOString(),
          amount: t.amount,
          type: t.type,
          description: t.description,
          createdAt: t.createdAt.toISOString(),
        })),
      }}
      tip={tip}
    />
  )
}
