import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { applyMonthlyInterest } from '@/lib/applyMonthlyInterest'

export async function POST(request: Request) {
  const session = await getSession()
  if (session.role !== 'banker' || !session.bankerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { year, month } = await request.json()
  const results = await applyMonthlyInterest(session.bankerId, parseInt(year), parseInt(month))
  return NextResponse.json({ results })
}
