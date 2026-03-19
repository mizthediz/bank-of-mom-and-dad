'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [kidPassword, setKidPassword] = useState('')
  const [kidError, setKidError] = useState('')
  const [kidLoading, setKidLoading] = useState(false)

  const [vaultOpen, setVaultOpen] = useState(false)
  const [bankerUsername, setBankerUsername] = useState('')
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
      body: JSON.stringify({ username, password: kidPassword, role: 'kid' }),
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
      body: JSON.stringify({ username: bankerUsername, password: bankerPassword, role: 'banker' }),
    })
    const data = await res.json()
    setBankerLoading(false)
    if (!res.ok) {
      setBankerError(data.error || 'Invalid credentials.')
      return
    }
    router.push(data.redirect)
  }

  function closeVault() {
    setVaultOpen(false)
    setBankerUsername('')
    setBankerPassword('')
    setBankerError('')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 px-6 pt-12 pb-24 relative">
        <div className="absolute top-5 right-5 flex items-center gap-3">
          <Link
            href="/signup"
            className="text-xs font-black text-white/50 hover:text-white/90 uppercase tracking-widest transition-colors"
          >
            Sign Up
          </Link>
          <button
            onClick={() => setVaultOpen(true)}
            className="text-xs font-black text-white/50 hover:text-white/90 uppercase tracking-widest transition-colors"
          >
            Banker Login
          </button>
        </div>
        <div className="max-w-md mx-auto text-center">
          <div className="text-5xl mb-4">🏦</div>
          <h1 className="text-3xl font-black text-white tracking-tight">Bank of Mom &amp; Dad</h1>
          <p className="mt-2 text-indigo-200 text-sm leading-relaxed">
            Track your savings, earn interest, and crush your goals!
          </p>
        </div>
      </div>

      {/* Login card */}
      <div className="relative z-10 max-w-md w-full mx-auto px-4 -mt-14 pb-12 flex-1">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-7">
          <h2 className="text-xl font-black text-slate-800 mb-1">Welcome back! 👋</h2>
          <p className="text-slate-400 text-sm mb-6">Log in to check your balance.</p>

          <form onSubmit={handleKidLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-username"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={kidPassword}
                onChange={(e) => setKidPassword(e.target.value)}
                placeholder="Your secret password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                required
              />
            </div>
            {kidError && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                <p className="text-rose-600 text-sm">{kidError}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={kidLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-xl disabled:opacity-50 text-base tracking-tight transition-colors"
            >
              {kidLoading ? 'Logging in…' : 'Log In →'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-xs mt-5">
            Ask your banker for your username.
          </p>
        </div>
      </div>

      {/* Banker vault modal */}
      {vaultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeVault} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7">
            <button
              onClick={closeVault}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔐</div>
              <h2 className="text-xl font-black text-slate-800">Banker Access</h2>
              <p className="text-sm text-slate-400 mt-1">Enter your credentials to access the vault</p>
            </div>
            <form onSubmit={handleBankerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Username</label>
                <input
                  type="text"
                  value={bankerUsername}
                  onChange={(e) => setBankerUsername(e.target.value)}
                  placeholder="Your banker username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                <input
                  type="password"
                  value={bankerPassword}
                  onChange={(e) => setBankerPassword(e.target.value)}
                  placeholder="Banker password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  required
                />
              </div>
              {bankerError && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                  <p className="text-rose-600 text-sm">{bankerError}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={bankerLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-xl disabled:opacity-50 tracking-tight transition-colors"
              >
                {bankerLoading ? 'Verifying…' : 'Enter Vault →'}
              </button>
              <div className="text-center">
                <Link
                  href="/signup"
                  onClick={closeVault}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                >
                  Create your own bank →
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LoginForm />
    </Suspense>
  )
}
