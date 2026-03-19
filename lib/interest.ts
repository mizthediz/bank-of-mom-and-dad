export function calculateMonthlyInterest(balance: number, annualRate: number): number {
  if (balance <= 0) return 0
  const monthly = balance * (annualRate / 12)
  return Math.round(monthly * 100) / 100
}

export function getLastMomentOfPriorMonth(now: Date): Date {
  // Last moment of the month prior to `now`
  return new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
}

export function getFirstOfMonth(year: number, month: number): Date {
  // month is 1-indexed
  return new Date(year, month - 1, 1, 0, 0, 0, 0)
}
