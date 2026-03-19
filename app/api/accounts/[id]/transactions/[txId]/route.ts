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

export async function PUT(request: Request, { params }: { params: { id: string; txId: string } }) {
  const session = await getSession()
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accountId = parseInt(params.id)
  const txId = parseInt(params.txId)
  const { date, type, amount, description } = await request.json()

  const signedAmount = type === 'debit' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount))

  const tx = await prisma.transaction.update({
    where: { id: txId },
    data: {
      date: new Date(date),
      amount: signedAmount,
      type,
      description: description || '',
    },
  })

  const newBalance = await recalcBalance(accountId)
  return NextResponse.json({ transaction: tx, newBalance })
}

export async function DELETE(_req: Request, { params }: { params: { id: string; txId: string } }) {
  const session = await getSession()
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accountId = parseInt(params.id)
  const txId = parseInt(params.txId)

  await prisma.transaction.delete({ where: { id: txId } })
  const newBalance = await recalcBalance(accountId)
  return NextResponse.json({ success: true, newBalance })
}
