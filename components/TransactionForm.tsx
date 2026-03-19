'use client'

import { useState } from 'react'

interface TransactionFormProps {
  accountId: number
  initialData?: {
    id: number
    date: string
    type: string
    amount: number
    description: string
  }
  onSuccess: () => void
  onCancel: () => void
}

export default function TransactionForm({ accountId, initialData, onSuccess, onCancel }: TransactionFormProps) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(initialData ? new Date(initialData.date).toISOString().split('T')[0] : today)
  const [type, setType] = useState(initialData?.type === 'debit' ? 'debit' : 'credit')
  const [amount, setAmount] = useState(initialData ? Math.abs(initialData.amount).toString() : '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a valid amount greater than $0.')
      return
    }
    setLoading(true)

    const url = initialData
      ? `/api/accounts/${accountId}/transactions/${initialData.id}`
      : `/api/accounts/${accountId}/transactions`
    const method = initialData ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, type, amount: amt, description }),
    })

    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
      return
    }
    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {initialData ? 'Edit Transaction' : 'Add Transaction'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <option value="credit">Money In (Credit)</option>
              <option value="debit">Money Out (Debit)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Birthday money"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-500 text-white font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
