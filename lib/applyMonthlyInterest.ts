import { prisma } from '@/lib/db'
import { calculateMonthlyInterest } from '@/lib/interest'

/**
 * Applies monthly interest to all accounts for a given banker and month.
 * Safe to call multiple times — skips accounts that already have interest for the month.
 *
 * @param bankerId - The banker whose accounts to process
 * @param year     - Full year (e.g. 2026)
 * @param month    - 1-indexed month (1 = January)
 */
export async function applyMonthlyInterest(
  bankerId: number,
  year: number,
  month: number
): Promise<{ username: string; applied: boolean; amount?: number; reason?: string }[]> {
  const settings = await prisma.bankerSettings.findUnique({ where: { bankerId } })
  const annualRate = settings?.annualInterestRate ?? 0.05

  const priorMonthEnd = new Date(year, month - 1, 0, 23, 59, 59, 999)

  const accounts = await prisma.account.findMany({
    where: { user: { bankerId } },
    include: { user: true },
  })

  const results: { username: string; applied: boolean; amount?: number; reason?: string }[] = []

  for (const account of accounts) {
    try {
      // Skip if already applied this month
      const existing = await prisma.transaction.findFirst({
        where: {
          accountId: account.id,
          type: 'interest',
          date: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1),
          },
        },
      })

      if (existing) {
        results.push({ username: account.user.username, applied: false, reason: 'Already applied' })
        continue
      }

      // Get balance as of end of prior month
      const balanceResult = await prisma.transaction.aggregate({
        where: { accountId: account.id, date: { lte: priorMonthEnd } },
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

      // Create the interest transaction dated the 1st of the month
      await prisma.transaction.create({
        data: {
          accountId: account.id,
          date: new Date(year, month - 1, 1, 0, 0, 0, 0),
          amount: interestAmount,
          type: 'interest',
          description: 'Monthly interest',
        },
      })

      // Recalculate and update the running balance
      const newBalResult = await prisma.transaction.aggregate({
        where: { accountId: account.id },
        _sum: { amount: true },
      })
      await prisma.account.update({
        where: { id: account.id },
        data: { currentBalance: newBalResult._sum.amount ?? 0 },
      })

      results.push({ username: account.user.username, applied: true, amount: interestAmount })
    } catch {
      // Never let a single account error break the loop
      results.push({ username: account.user.username, applied: false, reason: 'Error processing account' })
    }
  }

  return results
}
