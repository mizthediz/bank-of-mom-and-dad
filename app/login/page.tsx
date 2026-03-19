'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'kid' | 'banker'>('kid')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: mode === 'banker' ? 'admin' : username,
        password,
        role: mode === 'banker' ? 'admin' : 'customer',
      }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Try again!')
      return
    }
    router.push(data.redirect)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏦</div>
          <h1 className="text-3xl font-bold text-gray-800">Bank of Mom and Dad</h1>
          <p className="text-gray-500 mt-3 text-sm leading-relaxed">
            Mom or Dad sets up your account and adds your money. Log in to see your balance, track your savings, and watch your interest grow!
          </p>
        </div>

        {/* Toggle */}
        <div className="flex rounded-2xl bg-gray-100 p-1 mb-6">
          <button
            onClick={() => { setMode('kid'); setError('') }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'kid' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🧒 I&apos;m a Kid
          </button>
          <button
            onClick={() => { setMode('banker'); setError('') }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'banker' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
          >
            👨‍💼 I&apos;m the Banker
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'kid' && (
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Your Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  required
                />
              </div>
            )}
            {mode === 'banker' && (
              <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
                Logging in as <strong>admin</strong>
              </p>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-400 hover:bg-sky-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : mode === 'kid' ? 'Log In →' : 'Enter Vault →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
