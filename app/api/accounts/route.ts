import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (session.role !== 'banker' || !session.bankerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const users = await prisma.user.findMany({
    where: { bankerId: session.bankerId },
    include: { account: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (session.role !== 'banker' || !session.bankerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { username, password, colorTheme } = await request.json()
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
  }
  const existing = await prisma.user.findUnique({
    where: { username_bankerId: { username, bankerId: session.bankerId } },
  })
  if (existing) {
    return NextResponse.json({ error: 'Username already taken in this bank' }, { status: 409 })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      colorTheme: colorTheme ?? 'sky',
      bankerId: session.bankerId,
      account: { create: { currentBalance: 0 } },
    },
    include: { account: true },
  })
  return NextResponse.json(user, { status: 201 })
}
