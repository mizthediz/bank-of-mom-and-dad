import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.userId && session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accountId = parseInt(params.id)
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: { user: true, transactions: { orderBy: { date: 'desc' } } },
  })

  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Customers can only view their own account
  if (session.role === 'customer' && account.userId !== session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    id: account.id,
    userId: account.userId,
    username: account.user.username,
    colorTheme: account.user.colorTheme,
    currentBalance: account.currentBalance,
    transactions: account.transactions.map((t) => ({
      id: t.id,
      date: t.date,
      amount: t.amount,
      type: t.type,
      description: t.description,
      createdAt: t.createdAt,
    })),
  })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  const accountId = parseInt(params.id)

  const account = await prisma.account.findUnique({ where: { id: accountId }, include: { user: true } })
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()

  // Customers can only update their own colorTheme
  if (session.role === 'customer') {
    if (account.userId !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (body.colorTheme) {
      await prisma.user.update({ where: { id: account.userId }, data: { colorTheme: body.colorTheme } })
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  // Admin can update username and password
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const updateData: { username?: string; passwordHash?: string; colorTheme?: string } = {}

  if (body.username && body.username.trim() !== account.user.username) {
    const existing = await prisma.user.findUnique({ where: { username: body.username.trim() } })
    if (existing) return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    updateData.username = body.username.trim()
  }

  if (body.password) {
    if (body.password.length < 4) return NextResponse.json({ error: 'Password too short' }, { status: 400 })
    updateData.passwordHash = await bcrypt.hash(body.password, 10)
  }

  if (body.colorTheme) updateData.colorTheme = body.colorTheme

  await prisma.user.update({ where: { id: account.userId }, data: updateData })
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accountId = parseInt(params.id)
  const account = await prisma.account.findUnique({ where: { id: accountId } })
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Cascade delete via Prisma (onDelete: Cascade handles transactions)
  await prisma.user.delete({ where: { id: account.userId } })
  return NextResponse.json({ success: true })
}
