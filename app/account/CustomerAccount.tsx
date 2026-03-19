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
    if (period === 'ytd') return d >= new Date(currentYear, 0, 1)
    if (period === 'last-year') return d >= new Date(currentYear - 1, 0, 1) && d < new Date(currentYear, 0, 1)
    if (period === 'last-month') return d >= new Date(currentYear, currentMonth - 1, 1) && d < new Date(currentYear, currentMonth, 1)
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
    <div className="min-h-screen bg-slate-50">

      {/* Colored hero header */}
      <div className="relative z-0 px-5 pt-5 pb-16" style={{ backgroundColor: theme.hex }}>
        {/* Top bar */}
        <div className="max-w-lg mx-auto flex items-center justify-between mb-8">
          <div className={`text-sm font-bold tracking-widest uppercase ${theme.dark ? 'text-white/60' : 'text-black/40'}`}>
            My Account
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowThemePicker(true)}
              title="Customize theme"
              className={`p-2 rounded-xl ${theme.dark ? 'text-white/50 hover:text-white/90 hover:bg-white/10' : 'text-black/30 hover:text-black/60 hover:bg-black/10'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className={`text-sm font-bold px-3 py-1.5 rounded-xl ${theme.dark ? 'text-white/60 hover:text-white/90 hover:bg-white/10' : 'text-black/40 hover:text-black/70 hover:bg-black/10'}`}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Balance */}
        <div className="max-w-lg mx-auto">
          <p className={`text-sm font-semibold mb-1 ${theme.dark ? 'text-white/60' : 'text-black/40'}`}>
            Hi, {account.username}! 👋
          </p>
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.dark ? 'text-white/50' : 'text-black/30'}`}>
            Your Balance
          </p>
          <BalanceDisplay
            amount={account.currentBalance}
            size="xl"
            className={theme.dark ? '!text-white' : '!text-slate-900'}
          />
          {tip && (
            <p className={`mt-4 text-sm leading-relaxed ${theme.dark ? 'text-white/70' : 'text-black/50'}`}>
              💡 {tip}
            </p>
          )}
        </div>
      </div>

      {/* Theme Picker Modal */}
      {showThemePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowThemePicker(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="font-black text-slate-800">Your color</p>
              <button onClick={() => setShowThemePicker(false)} className="text-slate-300 hover:text-slate-500 text-2xl leading-none">&times;</button>
            </div>
            <ThemePicker
              accountId={account.id}
              currentTheme={account.colorTheme}
              onThemeChange={(key: ThemeKey) => { setAccount({ ...account, colorTheme: key }); setShowThemePicker(false) }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-lg mx-auto px-4 -mt-6">

        {/* Period Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1 mb-4 flex gap-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                period === p.key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Money In</p>
            <p className="font-black text-emerald-500 text-lg">${totalCredits.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Money Out</p>
            <p className="font-black text-rose-500 text-lg">${totalDebits.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Interest</p>
            <p className="font-black text-amber-500 text-lg">${totalInterest.toFixed(2)}</p>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-slate-800">Transactions</h2>
            {period !== 'all' && (
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                {filtered.length} shown
              </span>
            )}
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-2">🌱</p>
              <p className="text-slate-400 text-sm font-semibold">
                {account.transactions.length === 0 ? 'No transactions yet.' : 'No transactions in this period.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
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
