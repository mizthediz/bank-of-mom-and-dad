import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

async function recalcBalance(accountId: number) {
  const result = await prisma.transaction.aggregate({
    where: { accountId },
    _sum: { amount: true },
  })
  const newBalance = result._sum.amount ?? 0
  await prisma.account.update({ where: { id: accountId }, data: { currentBalance: newBalance } })
  return newBalance
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  const accountId = parseInt(params.id)

  const account = await prisma.account.findUnique({ where: { id: accountId } })
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (session.role === 'customer' && account.userId !== session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const transactions = await prisma.transaction.findMany({
    where: { accountId },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(transactions)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accountId = parseInt(params.id)
  const account = await prisma.account.findUnique({ where: { id: accountId } })
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { date, type, amount, description } = await request.json()

  if (!amount || isNaN(parseFloat(amount))) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const signedAmount = type === 'debit' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount))

  const tx = await prisma.transaction.create({
    data: {
      accountId,
      date: new Date(date),
      amount: signedAmount,
      type,
      description: description || '',
    },
  })

  const newBalance = await recalcBalance(accountId)
  return NextResponse.json({ transaction: tx, newBalance })
}
