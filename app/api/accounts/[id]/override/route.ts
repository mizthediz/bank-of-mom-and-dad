import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

async function getOwnedAccount(accountId: number, bankerId: number) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: { user: true },
  })
  if (!account || account.user.bankerId !== bankerId) return null
  return account
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (session.role !== 'banker' || !session.bankerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accountId = parseInt(params.id)
  const account = await getOwnedAccount(accountId, session.bankerId)
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { newBalance } = await request.json()
  const delta = parseFloat(newBalance) - account.currentBalance

  await prisma.transaction.create({
    data: {
      accountId,
      date: new Date(),
      amount: delta,
      type: 'override',
      description: 'Balance adjustment by Banker',
    },
  })

  await prisma.account.update({ where: { id: accountId }, data: { currentBalance: parseFloat(newBalance) } })

  return NextResponse.json({ success: true, newBalance: parseFloat(newBalance) })
}
