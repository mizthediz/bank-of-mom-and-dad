import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { calculateMonthlyInterest } from '@/lib/interest'

export async function POST(request: Request) {
  const session = await getSession()
  if (session.role !== 'banker' || !session.bankerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { year, month } = await request.json() // month is 1-indexed
  const y = parseInt(year)
  const m = parseInt(month)

  const settings = await prisma.bankerSettings.findUnique({ where: { bankerId: session.bankerId } })
  const annualRate = settings?.annualInterestRate ?? 0.05

  // Get the closing balance for each account as of the end of the prior month
  // i.e., all transactions up to the last moment of month (m-1) in year y
  const priorMonthEnd = new Date(y, m - 1, 0, 23, 59, 59, 999) // last day of prior month

  // Scope to this banker's accounts only
  const accounts = await prisma.account.findMany({
    where: { user: { bankerId: session.bankerId } },
    include: { user: true },
  })

  const results: { username: string; applied: boolean; amount?: number; reason?: string }[] = []

  for (const account of accounts) {
    // Check if interest already applied for this month
    const existing = await prisma.transaction.findFirst({
      where: {
        accountId: account.id,
        type: 'interest',
        date: {
          gte: new Date(y, m - 1, 1),
          lt: new Date(y, m, 1),
        },
      },
    })

    if (existing) {
      results.push({ username: account.user.username, applied: false, reason: 'Already applied' })
      continue
    }

    // Get balance as of end of prior month
    const balanceResult = await prisma.transaction.aggregate({
      where: {
        accountId: account.id,
        date: { lte: priorMonthEnd },
      },
      _sum: { amount: true },
    })

    const priorBalance = balanceResult._sum.amount ?? 0

    if (priorBalance <= 0) {
      results.push({ username: account.user.username, applied: false, reason: 'Balance was $0 or negative' })
      continue
    }

    const interestAmount = calculateMonthlyInterest(priorBalance, annualRate)

    if (interestAmount <= 0) {
      results.push({ username: account.user.username, applied: false, reason: 'Interest calculated to $0' })
      continue
    }

    // Apply interest
    const interestDate = new Date(y, m - 1, 1, 0, 0, 0, 0) // 1st of the month
    await prisma.transaction.create({
      data: {
        accountId: account.id,
        date: interestDate,
        amount: interestAmount,
        type: 'interest',
        description: 'Monthly interest',
      },
    })

    // Recalc balance
    const newBalResult = await prisma.transaction.aggregate({
      where: { accountId: account.id },
      _sum: { amount: true },
    })
    await prisma.account.update({
      where: { id: account.id },
      data: { currentBalance: newBalResult._sum.amount ?? 0 },
    })

    results.push({ username: account.user.username, applied: true, amount: interestAmount })
  }

  return NextResponse.json({ results })
}
