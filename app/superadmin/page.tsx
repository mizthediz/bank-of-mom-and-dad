'use client'

import { useState, useEffect } from 'react'

interface BankerRow {
  id: number
  username: string
  bankName: string
  kidCount: number
  createdAt: string
}

export default function SuperAdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [secret, setSecret] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [bankers, setBankers] = useState<BankerRow[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  async function checkAuth() {
    const res = await fetch('/api/superadmin')
    if (res.ok) {
      setAuthed(true)
      loadData()
    } else {
      setAuthed(false)
    }
  }

  async function loadData() {
    setDataLoading(true)
    const res = await fetch('/api/superadmin')
    if (res.ok) {
      const data = await res.json()
      setBankers(data)
    }
    setDataLoading(false)
  }

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)
    const res = await fetch('/api/superadmin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    })
    const data = await res.json()
    setAuthLoading(false)
    if (!res.ok) {
      setAuthError(data.error || 'Invalid secret.')
      return
    }
    setAuthed(true)
    loadData()
  }

  if (authed === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading…</div>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
          <h1 className="text-xl font-black text-slate-800 mb-1">Admin Access</h1>
          <p className="text-slate-400 text-sm mb-6">Enter the admin secret to continue.</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Secret
              </label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Admin secret"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                autoFocus
                required
              />
            </div>
            {authError && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                <p className="text-rose-600 text-sm">{authError}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-xl disabled:opacity-50 tracking-tight transition-colors"
            >
              {authLoading ? 'Verifying…' : 'Enter →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Super Admin</p>
          <h1 className="text-2xl font-black text-white tracking-tight">All Banks</h1>
        </div>

        {dataLoading ? (
          <div className="text-slate-500 text-sm">Loading banks…</div>
        ) : bankers.length === 0 ? (
          <div className="text-slate-500 text-sm">No banks found.</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Bank Name</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Username</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Kids</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody>
                {bankers.map((b, i) => (
                  <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-5 py-3 font-semibold text-slate-800">{b.bankName}</td>
                    <td className="px-5 py-3 text-slate-600 font-mono text-xs">{b.username}</td>
                    <td className="px-5 py-3 text-slate-600">{b.kidCount}</td>
                    <td className="px-5 py-3 text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-400">{bankers.length} bank{bankers.length !== 1 ? 's' : ''} total</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
