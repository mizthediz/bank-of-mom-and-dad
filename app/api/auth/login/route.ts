import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function POST(request: Request) {
  const { role, username, password } = await request.json()

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

  // Kid login — username is globally unique
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const session = await getSession()
  session.role = 'kid'
  session.userId = user.id
  session.bankerId = user.bankerId
  session.username = user.username
  await session.save()
  return NextResponse.json({ success: true, redirect: '/account' })
}
