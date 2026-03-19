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
    if (isNaN(amt) || amt <= 0) { setError('Please enter a valid amount greater than $0.'); return }
    setLoading(true)

    const url = initialData
      ? `/api/accounts/${accountId}/transactions/${initialData.id}`
      : `/api/accounts/${accountId}/transactions`
    const res = await fetch(url, {
      method: initialData ? 'PUT' : 'POST',
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

  const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent'
  const labelClass = 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5'

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7">
        <h3 className="text-lg font-black text-slate-800 mb-5">
          {initialData ? 'Edit Transaction' : 'Add Transaction'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
          </div>

          {/* Type toggle */}
          <div>
            <label className={labelClass}>Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('credit')}
                className={`flex-1 py-2.5 rounded-xl font-black text-sm border transition-all ${
                  type === 'credit'
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                ↑ Money In
              </button>
              <button
                type="button"
                onClick={() => setType('debit')}
                className={`flex-1 py-2.5 rounded-xl font-black text-sm border transition-all ${
                  type === 'debit'
                    ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                ↓ Money Out
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className={`${inputClass} pl-8`}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description <span className="text-slate-400 font-medium normal-case tracking-normal">— optional</span></label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Birthday money"
              className={inputClass}
            />
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
              <p className="text-rose-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-black hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black disabled:opacity-50">
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
