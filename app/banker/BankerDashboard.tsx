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
            <p className="text-xs text-gray-400">Banker View · Rate: {(annualInterestRate * 100).toFixed(1)}% / yr</p>
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
