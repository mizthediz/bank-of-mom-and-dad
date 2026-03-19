import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function GET() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } })
  const setupRequired = !settings || !settings.adminPasswordHash
  return NextResponse.json({ setupRequired })
}

export async function POST(request: Request) {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } })
  if (settings?.adminPasswordHash) {
    return NextResponse.json({ error: 'Setup already complete' }, { status: 400 })
  }

  const { password } = await request.json()
  if (!password || password.length < 4) {
    return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 10)
  await prisma.settings.upsert({
    where: { id: 1 },
    update: { adminPasswordHash: hash },
    create: { id: 1, adminPasswordHash: hash },
  })

  return NextResponse.json({ success: true })
}
