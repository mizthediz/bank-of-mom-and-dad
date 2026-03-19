'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface KidFormProps {
  mode: 'create' | 'edit'
  accountId?: number
  initialData?: { name: string; username: string }
  onSuccess?: () => void
  onCancel: () => void
}

export default function KidForm({ mode, accountId, initialData, onSuccess, onCancel }: KidFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name ?? '')
  const [username, setUsername] = useState(initialData?.username ?? '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Name is required.'); return }
    if (!username.trim()) { setError('Username is required.'); return }
    if (mode === 'create' && password.length < 4) { setError('Password must be at least 4 characters.'); return }
    if (mode === 'edit' && password && password.length < 4) { setError('Password must be at least 4 characters.'); return }

    setLoading(true)
    const res = mode === 'create'
      ? await fetch('/api/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), username: username.trim(), password }),
        })
      : await fetch(`/api/accounts/${accountId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), username: username.trim(), password: password || undefined }),
        })

    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
      return
    }
    if (mode === 'create') router.refresh()
    onSuccess?.()
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7">
        <h3 className="text-lg font-black text-slate-800 mb-5">
          {mode === 'create' ? '👶 Add a Kid' : '✏️ Edit Kid'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. emma"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
            <p className="text-xs text-slate-400 mt-1">Used to log in — must be unique</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Password{' '}
              {mode === 'edit' && <span className="text-slate-400 font-medium normal-case tracking-normal">— leave blank to keep current</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 4 characters"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent pr-16"
                required={mode === 'create'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-1"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
              <p className="text-rose-600 text-sm">{error}</p>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-black hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black disabled:opacity-50"
            >
              {loading ? 'Saving…' : mode === 'create' ? 'Add Kid' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
