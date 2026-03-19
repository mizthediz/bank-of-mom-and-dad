import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

async function getOwnedAccount(accountId: number, bankerId: number) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: { user: true, transactions: { orderBy: { date: 'desc' } } },
  })
  if (!account || account.user.bankerId !== bankerId) return null
  return account
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  const accountId = parseInt(params.id)

  let account = null
  if (session.role === 'banker' && session.bankerId) {
    account = await getOwnedAccount(accountId, session.bankerId)
  } else if (session.role === 'kid' && session.userId && session.bankerId) {
    account = await prisma.account.findFirst({
      where: { id: accountId, user: { id: session.userId, bankerId: session.bankerId } },
      include: { user: true, transactions: { orderBy: { date: 'desc' } } },
    })
  }

  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    ...account,
    username: account.user.username,
    colorTheme: account.user.colorTheme,
  })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (session.role !== 'banker' || !session.bankerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const accountId = parseInt(params.id)
  const account = await getOwnedAccount(accountId, session.bankerId)
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { username, colorTheme, password } = await request.json()
  const updateData: Record<string, string> = {}
  if (username) updateData.username = username
  if (colorTheme) updateData.colorTheme = colorTheme
  if (password) updateData.passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.update({ where: { id: account.userId }, data: updateData })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (session.role !== 'banker' || !session.bankerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const accountId = parseInt(params.id)
  const account = await getOwnedAccount(accountId, session.bankerId)
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.user.delete({ where: { id: account.userId } })
  return NextResponse.json({ success: true })
}
