import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session.userId && session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await prisma.settings.findUnique({ where: { id: 1 } })
  return NextResponse.json({ annualInterestRate: settings?.annualInterestRate ?? 0.05 })
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { annualInterestRate } = await request.json()
  const rate = parseFloat(annualInterestRate)

  if (isNaN(rate) || rate < 0 || rate > 1) {
    return NextResponse.json({ error: 'Rate must be between 0 and 1 (e.g. 0.05 for 5%)' }, { status: 400 })
  }

  await prisma.settings.upsert({
    where: { id: 1 },
    update: { annualInterestRate: rate },
    create: { id: 1, annualInterestRate: rate },
  })

  return NextResponse.json({ success: true, annualInterestRate: rate })
}
