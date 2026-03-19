import { redirect } from 'next/navigation'

// The one-time setup flow has been replaced by the multi-banker signup system.
export default async function SetupPage() {
  redirect('/signup')
}
