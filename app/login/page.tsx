'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  // Kid login state
  const [username, setUsername] = useState('')
  const [kidPassword, setKidPassword] = useState('')
  const [kidError, setKidError] = useState('')
  const [kidLoading, setKidLoading] = useState(false)

  // Banker modal state
  const [vaultOpen, setVaultOpen] = useState(false)
  const [bankerPassword, setBankerPassword] = useState('')
  const [bankerError, setBankerError] = useState('')
  const [bankerLoading, setBankerLoading] = useState(false)

  async function handleKidLogin(e: React.FormEvent) {
    e.preventDefault()
    setKidError('')
    setKidLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: kidPassword, role: 'customer' }),
    })
    const data = await res.json()
    setKidLoading(false)
    if (!res.ok) {
      setKidError(data.error || 'Something went wrong. Try again!')
      return
    }
    router.push(data.redirect)
  }

  async function handleBankerLogin(e: React.FormEvent) {
    e.preventDefault()
    setBankerError('')
    setBankerLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: bankerPassword, role: 'admin' }),
    })
    const data = await res.json()
    setBankerLoading(false)
    if (!res.ok) {
      setBankerError(data.error || 'Invalid password.')
      return
    }
    router.push(data.redirect)
  }

  function closeVault() {
    setVaultOpen(false)
    setBankerPassword('')
    setBankerError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">

      {/* Vault icon — top right */}
      <button
        onClick={() => setVaultOpen(true)}
        title="Banker login"
        className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5V19a1 1 0 001 1h16a1 1 0 001-1v-8.5M3 10.5L12 4l9 6.5M3 10.5h18" />
          <circle cx="12" cy="14" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5V10M12 18v-1.5M15 14h1.5M7.5 14H9" />
        </svg>
      </button>

      {/* Kids login */}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏦</div>
          <h1 className="text-3xl font-bold text-gray-800">Bank of Mom and Dad</h1>
          <p className="text-gray-500 mt-3 text-sm leading-relaxed">
            Log in to see your balance, track your savings, and watch your interest grow!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleKidLogin} className="space-y-4">
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
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
              <input
                type="password"
                value={kidPassword}
                onChange={(e) => setKidPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
                required
              />
            </div>
            {kidError && (
              <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{kidError}</p>
            )}
            <button
              type="submit"
              disabled={kidLoading}
              className="w-full bg-sky-400 hover:bg-sky-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {kidLoading ? 'Logging in...' : 'Log In →'}
            </button>
          </form>
        </div>
      </div>

      {/* Banker vault modal */}
      {vaultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeVault}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-sm">
            {/* Close */}
            <button
              onClick={closeVault}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🔐</div>
              <h2 className="text-xl font-bold text-gray-800">Banker Access</h2>
              <p className="text-sm text-gray-500 mt-1">Enter your password to access the vault</p>
            </div>

            <form onSubmit={handleBankerLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  value={bankerPassword}
                  onChange={(e) => setBankerPassword(e.target.value)}
                  placeholder="Banker password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  autoFocus
                  required
                />
              </div>
              {bankerError && (
                <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{bankerError}</p>
              )}
              <button
                type="submit"
                disabled={bankerLoading}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {bankerLoading ? 'Verifying...' : 'Enter Vault →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
