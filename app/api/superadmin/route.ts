import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function POST(request: Request) {
  const { secret } = await request.json()
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }
  const session = await getSession()
  session.role = 'superadmin'
  await session.save()
  return NextResponse.json({ success: true })
}

export async function GET() {
  const session = await getSession()
  if (session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const bankers = await prisma.banker.findMany({
    include: {
      _count: { select: { users: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(bankers.map(b => ({
    id: b.id,
    username: b.username,
    bankName: b.bankName,
    kidCount: b._count.users,
    createdAt: b.createdAt,
  })))
}
