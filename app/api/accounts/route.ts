import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accounts = await prisma.account.findMany({
    include: {
      user: true,
      transactions: {
        orderBy: { date: 'desc' },
        take: 1,
      },
    },
    orderBy: { user: { username: 'asc' } },
  })

  const result = accounts.map((a) => ({
    id: a.id,
    userId: a.userId,
    username: a.user.username,
    colorTheme: a.user.colorTheme,
    currentBalance: a.currentBalance,
    lastTransactionDate: a.transactions[0]?.date ?? null,
  }))

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { username, password } = await request.json()
  if (!username || username.trim().length === 0) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }
  if (!password || password.length < 4) {
    return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { username: username.trim() } })
  if (existing) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      username: username.trim(),
      passwordHash,
      account: { create: { currentBalance: 0 } },
    },
    include: { account: true },
  })

  return NextResponse.json({ id: user.account!.id, userId: user.id, username: user.username })
}
