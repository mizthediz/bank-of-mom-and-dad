'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BalanceDisplay from '@/components/BalanceDisplay'
import KidForm from '@/components/KidForm'
import { getTheme } from '@/lib/themes'

interface Account {
  id: number
  userId: number
  name: string
  username: string
  colorTheme: string
  currentBalance: number
  lastTransactionDate: string | null
}

interface Props {
  accounts: Account[]
  annualInterestRate: number
  bankName: string
}

export default function BankerDashboard({ accounts, annualInterestRate, bankName }: Props) {
  const router = useRouter()
  const [showAddKid, setShowAddKid] = useState(false)
  const [rate, setRate] = useState(annualInterestRate)
  const [editingRate, setEditingRate] = useState(false)
  const [newRate, setNewRate] = useState((annualInterestRate * 100).toFixed(1))

  async function handleSaveRate(e: React.FormEvent) {
    e.preventDefault()
    const rateVal = parseFloat(newRate) / 100
    if (isNaN(rateVal) || rateVal < 0 || rateVal > 1) return
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ annualInterestRate: rateVal }),
    })
    setRate(rateVal)
    setEditingRate(false)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const totalBalance = accounts.reduce((s, a) => s + a.currentBalance, 0)

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-slate-900 px-5 pt-8 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Banker View</p>
              <h1 className="text-2xl font-black text-white tracking-tight">🏦 {bankName}</h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-slate-300 text-sm font-semibold mt-1"
            >
              Log out
            </button>
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Savings</p>
              <p className="text-white font-black text-2xl">${totalBalance.toFixed(2)}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Interest Rate</p>
                <button
                  onClick={() => { setNewRate((rate * 100).toFixed(1)); setEditingRate(true) }}
                  className="text-slate-500 hover:text-slate-300 -mt-1"
                  title="Edit rate"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              {editingRate ? (
                <form onSubmit={handleSaveRate} className="flex items-center gap-1.5 mt-1">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="w-16 text-sm bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white focus:outline-none"
                    autoFocus
                  />
                  <span className="text-slate-400 text-xs">%</span>
                  <button type="submit" className="text-xs text-emerald-400 font-bold hover:text-emerald-300">Save</button>
                  <button type="button" onClick={() => setEditingRate(false)} className="text-xs text-slate-500 hover:text-slate-400">✕</button>
                </form>
              ) : (
                <p className="text-emerald-400 font-black text-2xl">{(rate * 100).toFixed(1)}%</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kids list */}
      <div className="max-w-2xl mx-auto px-4 -mt-6 pb-12">
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={() => setShowAddKid(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2 rounded-xl text-sm shadow-sm"
          >
            + Add Kid
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm text-center py-16 px-6">
            <div className="text-5xl mb-3">👶</div>
            <p className="font-black text-slate-700 text-lg">Add your first kid!</p>
            <p className="text-slate-400 text-sm mt-1">They&apos;ll get their own account to track savings.</p>
            <button
              onClick={() => setShowAddKid(true)}
              className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-3 rounded-xl text-sm inline-block"
            >
              + Add Kid
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => {
              const theme = getTheme(account.colorTheme)
              const lastDate = account.lastTransactionDate
                ? new Date(account.lastTransactionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'No transactions yet'

              return (
                <Link key={account.id} href={`/banker/${account.id}`}>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                    <div className="h-1.5" style={{ backgroundColor: theme.hex }} />
                    <div className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black"
                          style={{ backgroundColor: theme.hex + '30', color: theme.hex }}
                        >
                          {account.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-800">{account.name}</p>
                          <p className="text-xs text-slate-400 font-medium">Last activity: {lastDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <BalanceDisplay amount={account.currentBalance} size="lg" />
                        <p className="text-xs text-slate-400 font-medium mt-0.5">balance</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {showAddKid && (
        <KidForm
          mode="create"
          onCancel={() => setShowAddKid(false)}
          onSuccess={() => { setShowAddKid(false); router.refresh() }}
        />
      )}
    </div>
  )
}
