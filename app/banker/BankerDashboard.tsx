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
  username: string
  colorTheme: string
  currentBalance: number
  lastTransactionDate: string | null
}

interface Props {
  accounts: Account[]
  annualInterestRate: number
}

export default function BankerDashboard({ accounts, annualInterestRate }: Props) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">🏦 Bank of Mom and Dad</h1>
            {editingRate ? (
              <form onSubmit={handleSaveRate} className="flex items-center gap-1 mt-0.5">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="w-16 text-xs border border-gray-300 rounded px-1 py-0.5 text-gray-700"
                  autoFocus
                />
                <span className="text-xs text-gray-400">% / yr</span>
                <button type="submit" className="text-xs text-sky-500 font-semibold hover:text-sky-700">Save</button>
                <button type="button" onClick={() => setEditingRate(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
              </form>
            ) : (
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-400">Banker View · Rate: {(rate * 100).toFixed(1)}% / yr</p>
                <button onClick={() => { setNewRate((rate * 100).toFixed(1)); setEditingRate(true) }} className="text-gray-300 hover:text-gray-500 transition-colors" title="Edit rate">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Add Kid Button */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-700">
            {accounts.length === 0 ? 'No kids yet' : `${accounts.length} kid${accounts.length !== 1 ? 's' : ''}`}
          </h2>
          <button
            onClick={() => setShowAddKid(true)}
            className="bg-sky-400 hover:bg-sky-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            + Add Kid
          </button>
        </div>

        {/* Account Cards */}
        {accounts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">👶</div>
            <p className="font-semibold">Add your first kid to get started!</p>
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
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="h-2" style={{ backgroundColor: theme.hex }} />
                    <div className="px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800 text-lg capitalize">{account.username}</p>
                        <p className="text-xs text-gray-400">Last activity: {lastDate}</p>
                      </div>
                      <div className="text-right">
                        <BalanceDisplay amount={account.currentBalance} size="lg" />
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
