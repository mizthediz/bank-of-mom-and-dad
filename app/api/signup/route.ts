import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function POST(request: Request) {
  const { username, password, bankName } = await request.json()

  if (!username || !password || !bankName) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }
  if (username.length < 3) {
    return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }
  if (bankName.length < 2) {
    return NextResponse.json({ error: 'Bank name must be at least 2 characters' }, { status: 400 })
  }

  const existing = await prisma.banker.findUnique({ where: { username } })
  if (existing) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const banker = await prisma.banker.create({
    data: {
      username,
      passwordHash,
      bankName,
      settings: { create: { annualInterestRate: 0.05 } },
    },
  })

  const session = await getSession()
  session.role = 'banker'
  session.bankerId = banker.id
  session.username = banker.username
  session.bankName = banker.bankName
  await session.save()

  return NextResponse.json({ success: true, redirect: '/banker' })
}
