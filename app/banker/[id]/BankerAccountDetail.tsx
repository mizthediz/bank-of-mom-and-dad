'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BalanceDisplay from '@/components/BalanceDisplay'
import TransactionRow from '@/components/TransactionRow'
import TransactionForm from '@/components/TransactionForm'
import ConfirmDialog from '@/components/ConfirmDialog'
import KidForm from '@/components/KidForm'
import { getTheme } from '@/lib/themes'

interface Transaction {
  id: number
  date: string
  amount: number
  type: string
  description: string
  createdAt?: string
}

interface Account {
  id: number
  userId: number
  username: string
  colorTheme: string
  currentBalance: number
  transactions: Transaction[]
}

interface Props {
  account: Account
  annualInterestRate: number
}

export default function BankerAccountDetail({ account: initialAccount, annualInterestRate: initialRate }: Props) {
  const router = useRouter()
  const [account, setAccount] = useState(initialAccount)
  const [rate, setRate] = useState(initialRate)

  const [showAddTx, setShowAddTx] = useState(false)
  const [editTx, setEditTx] = useState<Transaction | null>(null)
  const [deleteTxId, setDeleteTxId] = useState<number | null>(null)
  const [showOverride, setShowOverride] = useState(false)
  const [overrideValue, setOverrideValue] = useState('')
  const [showEditKid, setShowEditKid] = useState(false)
  const [showDeleteKid, setShowDeleteKid] = useState(false)
  const [showInterest, setShowInterest] = useState(false)
  const [editingRate, setEditingRate] = useState(false)
  const [newRate, setNewRate] = useState((rate * 100).toFixed(2))
  const [interestMonth, setInterestMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const [interestResult, setInterestResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const theme = getTheme(account.colorTheme)

  async function refreshAccount() {
    const res = await fetch(`/api/accounts/${account.id}`)
    if (res.ok) setAccount(await res.json())
  }

  async function handleDeleteTx() {
    if (!deleteTxId) return
    await fetch(`/api/accounts/${account.id}/transactions/${deleteTxId}`, { method: 'DELETE' })
    setDeleteTxId(null)
    refreshAccount()
  }

  async function handleOverride(e: React.FormEvent) {
    e.preventDefault()
    const val = parseFloat(overrideValue)
    if (isNaN(val)) return
    setLoading(true)
    await fetch(`/api/accounts/${account.id}/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newBalance: val }),
    })
    setLoading(false)
    setShowOverride(false)
    setOverrideValue('')
    refreshAccount()
  }

  async function handleSaveRate(e: React.FormEvent) {
    e.preventDefault()
    const rateVal = parseFloat(newRate) / 100
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ annualInterestRate: rateVal }),
    })
    setRate(rateVal)
    setEditingRate(false)
  }

  async function handleApplyInterest() {
    const [y, m] = interestMonth.split('-')
    setLoading(true)
    const res = await fetch('/api/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year: y, month: m }),
    })
    const data = await res.json()
    setLoading(false)
    const result = data.results?.find((r: { username: string }) => r.username === account.username)
    if (result) {
      setInterestResult(result.applied
        ? `✅ Interest of $${result.amount?.toFixed(2)} applied!`
        : `ℹ️ ${result.reason}`)
    }
    refreshAccount()
  }

  async function handleDeleteKid() {
    await fetch(`/api/accounts/${account.id}`, { method: 'DELETE' })
    router.push('/banker')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Colored header */}
      <div className="px-5 pt-5 pb-16 relative z-0" style={{ backgroundColor: theme.hex }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/banker"
              className={`flex items-center gap-1.5 text-sm font-bold ${theme.dark ? 'text-white/60 hover:text-white/90' : 'text-black/40 hover:text-black/70'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              All Kids
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditKid(true)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl ${theme.dark ? 'text-white/60 hover:text-white/90 hover:bg-white/10' : 'text-black/40 hover:text-black/70 hover:bg-black/10'}`}
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteKid(true)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl ${theme.dark ? 'text-rose-300/70 hover:text-rose-200 hover:bg-white/10' : 'text-rose-500/60 hover:text-rose-600 hover:bg-black/10'}`}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black"
              style={{ backgroundColor: theme.dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }}
            >
              <span className={theme.dark ? 'text-white' : 'text-slate-800'}>
                {account.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${theme.dark ? 'text-white/50' : 'text-black/30'}`}>Account</p>
              <h1 className={`text-2xl font-black capitalize ${theme.dark ? 'text-white' : 'text-slate-900'}`}>
                {account.username}
              </h1>
            </div>
          </div>

          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${theme.dark ? 'text-white/50' : 'text-black/30'}`}>Balance</p>
          <BalanceDisplay
            amount={account.currentBalance}
            size="xl"
            className={theme.dark ? '!text-white' : '!text-slate-900'}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6 pb-12 relative z-10">

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowAddTx(true)}
              className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-sm"
            >
              + Add Transaction
            </button>
            <button
              onClick={() => { setOverrideValue(account.currentBalance.toFixed(2)); setShowOverride(true) }}
              className="py-3 rounded-xl border border-slate-200 text-slate-700 font-black text-sm hover:bg-slate-50"
            >
              Set Balance
            </button>
          </div>
        </div>

        {/* Interest Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Interest Rate</p>
              <p className="text-2xl font-black text-emerald-500">{(rate * 100).toFixed(1)}% / yr</p>
            </div>
            <button
              onClick={() => setShowInterest(!showInterest)}
              className={`text-sm font-black px-4 py-2 rounded-xl transition-colors ${
                showInterest
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
              }`}
            >
              {showInterest ? 'Hide' : 'Apply Interest'}
            </button>
          </div>

          {showInterest && (
            <div className="border-t border-slate-50 mt-4 pt-4 space-y-3">
              {!editingRate ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Global interest rate</span>
                  <button onClick={() => setEditingRate(true)} className="text-sm text-indigo-600 font-black hover:text-indigo-700">
                    Change Rate
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveRate} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-8 text-slate-800"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">%</span>
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-black hover:bg-indigo-700">Save</button>
                  <button type="button" onClick={() => setEditingRate(false)} className="border border-slate-200 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">✕</button>
                </form>
              )}

              <div className="flex gap-2 items-center">
                <input
                  type="month"
                  value={interestMonth}
                  onChange={(e) => setInterestMonth(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800"
                />
                <button
                  onClick={handleApplyInterest}
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-5 py-2 rounded-xl text-sm disabled:opacity-50"
                >
                  {loading ? '…' : 'Apply'}
                </button>
              </div>

              {interestResult && (
                <p className="text-sm text-slate-700 bg-slate-50 rounded-xl px-4 py-3 font-medium">{interestResult}</p>
              )}
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-8">
          <h2 className="font-black text-slate-800 mb-4">All Transactions</h2>
          {account.transactions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-2">🌱</p>
              <p className="text-slate-400 text-sm font-semibold">No transactions yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {account.transactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  onEdit={(t) => setEditTx(t)}
                  onDelete={(id) => setDeleteTxId(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddTx && (
        <TransactionForm
          accountId={account.id}
          onSuccess={() => { setShowAddTx(false); refreshAccount() }}
          onCancel={() => setShowAddTx(false)}
        />
      )}
      {editTx && (
        <TransactionForm
          accountId={account.id}
          initialData={editTx}
          onSuccess={() => { setEditTx(null); refreshAccount() }}
          onCancel={() => setEditTx(null)}
        />
      )}
      {deleteTxId && (
        <ConfirmDialog
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction? The account balance will be updated."
          onConfirm={handleDeleteTx}
          onCancel={() => setDeleteTxId(null)}
          confirmLabel="Delete"
          danger
        />
      )}
      {showOverride && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7">
            <h3 className="text-lg font-black text-slate-800 mb-1">Set Balance</h3>
            <p className="text-sm text-slate-400 mb-5">
              Enter the new balance. A transaction will be created to record the change.
            </p>
            <form onSubmit={handleOverride} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">$</span>
                <input
                  type="number"
                  value={overrideValue}
                  onChange={(e) => setOverrideValue(e.target.value)}
                  step="0.01"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-slate-800 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowOverride(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-black hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black disabled:opacity-50">
                  {loading ? 'Saving…' : 'Set Balance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditKid && (
        <KidForm
          mode="edit"
          accountId={account.id}
          initialData={{ username: account.username }}
          onSuccess={() => refreshAccount()}
          onCancel={() => setShowEditKid(false)}
        />
      )}
      {showDeleteKid && (
        <ConfirmDialog
          title={`Delete ${account.username}'s account`}
          message={`This will permanently delete ${account.username}'s account and all their transaction history. This cannot be undone.`}
          onConfirm={handleDeleteKid}
          onCancel={() => setShowDeleteKid(false)}
          confirmLabel="Delete Account"
          danger
        />
      )}
    </div>
  )
}
