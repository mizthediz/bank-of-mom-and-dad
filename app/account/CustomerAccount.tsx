'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BalanceDisplay from '@/components/BalanceDisplay'
import TransactionRow from '@/components/TransactionRow'
import ThemePicker from '@/components/ThemePicker'
import { getTheme, ThemeKey } from '@/lib/themes'

interface Transaction {
  id: number
  date: string
  amount: number
  type: string
  description: string
  createdAt: string
}

interface Account {
  id: number
  username: string
  colorTheme: string
  currentBalance: number
  transactions: Transaction[]
}

type Period = 'all' | 'ytd' | 'last-year' | 'last-month'

function filterTransactions(transactions: Transaction[], period: Period): Transaction[] {
  if (period === 'all') return transactions
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  return transactions.filter((t) => {
    const d = new Date(t.date)
    if (period === 'ytd') {
      return d >= new Date(currentYear, 0, 1)
    }
    if (period === 'last-year') {
      return d >= new Date(currentYear - 1, 0, 1) && d < new Date(currentYear, 0, 1)
    }
    if (period === 'last-month') {
      return d >= new Date(currentYear, currentMonth - 1, 1) && d < new Date(currentYear, currentMonth, 1)
    }
    return true
  })
}

export default function CustomerAccount({ account: initialAccount, tip }: { account: Account; tip: string }) {
  const router = useRouter()
  const [account, setAccount] = useState(initialAccount)
  const [period, setPeriod] = useState<Period>('all')
  const [showThemePicker, setShowThemePicker] = useState(false)

  const theme = getTheme(account.colorTheme)
  const filtered = filterTransactions(account.transactions, period)

  const totalCredits = filtered.filter((t) => t.amount > 0 && t.type !== 'debit').reduce((s, t) => s + t.amount, 0)
  const totalDebits = Math.abs(filtered.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0))
  const totalInterest = filtered.filter((t) => t.type === 'interest').reduce((s, t) => s + t.amount, 0)

  const PERIODS: { key: Period; label: string }[] = [
    { key: 'all', label: 'All Time' },
    { key: 'ytd', label: 'This Year' },
    { key: 'last-year', label: 'Last Year' },
    { key: 'last-month', label: 'Last Month' },
  ]

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="px-4 pt-6 pb-10 relative" style={{ backgroundColor: theme.hex }}>
        <div className="max-w-lg mx-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleLogout}
              className={`text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity ${theme.dark ? 'text-white' : 'text-gray-700'}`}
            >
              Log out
            </button>
          </div>
          <h1 className={`text-2xl font-bold mb-1 ${theme.dark ? 'text-white' : 'text-gray-800'}`}>
            Hi, {account.username}! 👋
          </h1>
          <p className={`text-sm mb-5 ${theme.dark ? 'text-white/80' : 'text-gray-600'}`}>
            💡 {tip}
          </p>
          <p className={`text-sm font-semibold mb-1 ${theme.dark ? 'text-white/70' : 'text-gray-600'}`}>Your balance</p>
          <BalanceDisplay
            amount={account.currentBalance}
            size="xl"
            className={theme.dark ? '!text-white' : '!text-gray-800'}
          />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        {/* Customize Button */}
        <div className="mb-4">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            🎨 Make it mine
          </button>
        </div>

        {showThemePicker && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
            <ThemePicker
              accountId={account.id}
              currentTheme={account.colorTheme}
              onThemeChange={(key: ThemeKey) => setAccount({ ...account, colorTheme: key })}
            />
          </div>
        )}

        {/* Period Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-4 flex">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${period === p.key ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400 font-semibold mb-1">Money In</p>
            <p className="font-bold text-emerald-500 text-lg">${totalCredits.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400 font-semibold mb-1">Money Out</p>
            <p className="font-bold text-red-500 text-lg">${totalDebits.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400 font-semibold mb-1">Interest</p>
            <p className="font-bold text-sky-500 text-lg">${totalInterest.toFixed(2)}</p>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <h2 className="font-bold text-gray-700 mb-3">
            Transactions
            {period !== 'all' && (
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filtered.length} shown)
              </span>
            )}
          </h2>
          {filtered.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              {account.transactions.length === 0 ? 'No transactions yet.' : 'No transactions in this period.'}
            </p>
          ) : (
            <div>
              {filtered.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
