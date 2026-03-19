import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function POST(request: Request) {
  const { username, password, role } = await request.json()

  if (role === 'admin') {
    if (username !== 'admin') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const settings = await prisma.settings.findUnique({ where: { id: 1 } })
    if (!settings?.adminPasswordHash) {
      return NextResponse.json({ error: 'Setup not complete' }, { status: 400 })
    }
    const valid = await bcrypt.compare(password, settings.adminPasswordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const session = await getSession()
    session.userId = -1
    session.role = 'admin'
    session.username = 'admin'
    await session.save()
    return NextResponse.json({ success: true, redirect: '/banker' })
  }

  // Customer login
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const session = await getSession()
  session.userId = user.id
  session.role = 'customer'
  session.username = user.username
  await session.save()
  return NextResponse.json({ success: true, redirect: '/account' })
}
