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

  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: { user: true },
  })
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Kids can only view their own account's transactions
  if (session.role === 'kid') {
    if (account.userId !== session.userId || account.user.bankerId !== session.bankerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } else if (session.role === 'banker') {
    // Bankers can only view accounts belonging to their bank
    if (account.user.bankerId !== session.bankerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } else {
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
  if (session.role !== 'banker' || !session.bankerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accountId = parseInt(params.id)
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: { user: true },
  })
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Ownership check — banker can only post to their own bank's accounts
  if (account.user.bankerId !== session.bankerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
