'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface KidFormProps {
  mode: 'create' | 'edit'
  accountId?: number
  initialData?: { username: string }
  onSuccess?: () => void
  onCancel: () => void
}

export default function KidForm({ mode, accountId, initialData, onSuccess, onCancel }: KidFormProps) {
  const router = useRouter()
  const [username, setUsername] = useState(initialData?.username ?? '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Username is required.')
      return
    }
    if (mode === 'create' && password.length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }
    if (mode === 'edit' && password && password.length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }

    setLoading(true)
    let res: Response

    if (mode === 'create') {
      res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
    } else {
      res = await fetch(`/api/accounts/${accountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password || undefined }),
      })
    }

    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
      return
    }

    if (mode === 'create') {
      router.refresh()
    }
    onSuccess?.()
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {mode === 'create' ? 'Add a Kid' : 'Edit Kid'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. emma"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Password {mode === 'edit' && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 4 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300 pr-12"
                required={mode === 'create'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
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
              {loading ? 'Saving...' : mode === 'create' ? 'Add Kid' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
