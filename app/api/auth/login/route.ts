import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function POST(request: Request) {
  const { role, username, password, bankUsername } = await request.json()

  if (role === 'banker') {
    const banker = await prisma.banker.findUnique({ where: { username } })
    if (!banker) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const valid = await bcrypt.compare(password, banker.passwordHash)
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const session = await getSession()
    session.role = 'banker'
    session.bankerId = banker.id
    session.username = banker.username
    session.bankName = banker.bankName
    await session.save()
    return NextResponse.json({ success: true, redirect: '/banker' })
  }

  // Kid login — requires bankUsername to scope the lookup
  if (!bankUsername) return NextResponse.json({ error: 'Bank name is required' }, { status: 400 })

  const banker = await prisma.banker.findUnique({ where: { username: bankUsername } })
  if (!banker) return NextResponse.json({ error: 'Bank not found' }, { status: 404 })

  const user = await prisma.user.findUnique({
    where: { username_bankerId: { username, bankerId: banker.id } },
  })
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const session = await getSession()
  session.role = 'kid'
  session.userId = user.id
  session.bankerId = banker.id
  session.username = user.username
  await session.save()
  return NextResponse.json({ success: true, redirect: '/account' })
}
