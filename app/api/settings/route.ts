import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session.bankerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const settings = await prisma.bankerSettings.findUnique({ where: { bankerId: session.bankerId } })
  return NextResponse.json({ annualInterestRate: settings?.annualInterestRate ?? 0.05 })
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (session.role !== 'banker' || !session.bankerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { annualInterestRate } = await request.json()
  const rate = parseFloat(annualInterestRate)
  if (isNaN(rate) || rate < 0 || rate > 1) {
    return NextResponse.json({ error: 'Rate must be between 0 and 1 (e.g. 0.05 for 5%)' }, { status: 400 })
  }
  await prisma.bankerSettings.upsert({
    where: { bankerId: session.bankerId },
    update: { annualInterestRate: rate },
    create: { bankerId: session.bankerId, annualInterestRate: rate },
  })
  return NextResponse.json({ success: true, annualInterestRate: rate })
}
