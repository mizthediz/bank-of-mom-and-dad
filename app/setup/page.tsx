import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import SetupForm from './SetupForm'

export default async function SetupPage() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } })
  if (settings?.adminPasswordHash) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏦</div>
          <h1 className="text-3xl font-bold text-gray-800">Bank of Mom and Dad</h1>
          <p className="text-gray-500 mt-2">Welcome! Let&apos;s get you set up.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Set your Banker password</h2>
          <p className="text-gray-500 text-sm mb-6">
            You&apos;ll use this to log in as the Banker and manage your kids&apos; accounts.
          </p>
          <SetupForm />
        </div>
      </div>
    </div>
  )
}
