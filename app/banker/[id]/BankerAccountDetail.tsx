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
    if (res.ok) {
      const data = await res.json()
      setAccount(data)
    }
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
      if (result.applied) {
        setInterestResult(`✅ Interest of $${result.amount?.toFixed(2)} applied!`)
      } else {
        setInterestResult(`ℹ️ ${result.reason}`)
      }
    }
    refreshAccount()
  }

  async function handleDeleteKid() {
    await fetch(`/api/accounts/${account.id}`, { method: 'DELETE' })
    router.push('/banker')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-white px-4 pt-6 pb-8" style={{ backgroundColor: theme.hex }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/banker" className="text-white/70 hover:text-white text-sm">
              ← Back
            </Link>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${theme.dark ? 'text-white' : 'text-gray-800'}`}>
                {account.username}
              </h1>
              <p className={`text-sm mt-1 ${theme.dark ? 'text-white/70' : 'text-gray-600'}`}>Account Balance</p>
              <BalanceDisplay
                amount={account.currentBalance}
                size="xl"
                className={theme.dark ? 'text-white' : 'text-gray-800'}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4">
        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowAddTx(true)}
              className="py-2.5 rounded-xl bg-sky-400 hover:bg-sky-500 text-white font-bold text-sm transition-colors"
            >
              + Add Transaction
            </button>
            <button
              onClick={() => { setOverrideValue(account.currentBalance.toFixed(2)); setShowOverride(true) }}
              className="py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Set Balance
            </button>
            <button
              onClick={() => setShowEditKid(true)}
              className="py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              ✏️ Edit Kid
            </button>
            <button
              onClick={() => setShowDeleteKid(true)}
              className="py-2.5 rounded-xl border border-red-100 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors"
            >
              🗑️ Delete Kid
            </button>
          </div>
        </div>

        {/* Interest Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-bold text-gray-700">Interest Rate</p>
              <p className="text-2xl font-bold text-emerald-500">{(rate * 100).toFixed(1)}% / yr</p>
            </div>
            <button
              onClick={() => setShowInterest(!showInterest)}
              className="text-sm text-sky-500 hover:text-sky-600 font-semibold"
            >
              {showInterest ? 'Hide' : 'Apply Interest'}
            </button>
          </div>

          {showInterest && (
            <div className="border-t border-gray-50 pt-3 space-y-3">
              {!editingRate ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Edit global rate:</span>
                  <button onClick={() => setEditingRate(true)} className="text-sm text-sky-500 font-semibold">
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
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                  <button type="submit" className="bg-sky-400 text-white px-3 py-2 rounded-xl text-sm font-bold">Save</button>
                  <button type="button" onClick={() => setEditingRate(false)} className="border border-gray-200 px-3 py-2 rounded-xl text-sm">Cancel</button>
                </form>
              )}

              <div className="flex gap-2 items-center">
                <input
                  type="month"
                  value={interestMonth}
                  onChange={(e) => setInterestMonth(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
                <button
                  onClick={handleApplyInterest}
                  disabled={loading}
                  className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  {loading ? '...' : 'Apply'}
                </button>
              </div>
              {interestResult && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">{interestResult}</p>
              )}
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <h2 className="font-bold text-gray-700 mb-3">All Transactions</h2>
          {account.transactions.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No transactions yet.</p>
          ) : (
            <div>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Set Balance</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter the new balance. A transaction will be created to record the change.
            </p>
            <form onSubmit={handleOverride} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  value={overrideValue}
                  onChange={(e) => setOverrideValue(e.target.value)}
                  step="0.01"
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowOverride(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-sky-400 text-white font-bold disabled:opacity-50">
                  {loading ? 'Saving...' : 'Set Balance'}
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
