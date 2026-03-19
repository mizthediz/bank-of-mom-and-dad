import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import SetupForm from './SetupForm'

export default async function SetupPage() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } })
  if (settings?.adminPasswordHash) redirect('/login')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 px-6 pt-12 pb-24">
        <div className="max-w-md mx-auto text-center">
          <div className="text-5xl mb-4">🏦</div>
          <h1 className="text-3xl font-black text-white tracking-tight">Bank of Mom & Dad</h1>
          <p className="mt-2 text-indigo-200 text-sm">Let&apos;s get your bank set up!</p>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto px-4 -mt-14 pb-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-7">
          <h2 className="text-xl font-black text-slate-800 mb-1">Create your Banker password</h2>
          <p className="text-slate-400 text-sm mb-6">
            You&apos;ll use this to log in and manage your kids&apos; accounts.
          </p>
          <SetupForm />
        </div>
      </div>
    </div>
  )
}
