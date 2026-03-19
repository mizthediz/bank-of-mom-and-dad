import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bank of Mom and Dad',
  description: 'A digital piggy bank for kids. Set allowances, track savings, and teach kids about money — all in one simple app.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://bankofmomand.dad'),
  openGraph: {
    title: 'Bank of Mom and Dad',
    description: 'A digital piggy bank for kids. Set allowances, track savings, and teach kids about money — all in one simple app.',
    siteName: 'Bank of Mom and Dad',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bank of Mom and Dad',
    description: 'A digital piggy bank for kids. Set allowances, track savings, and teach kids about money — all in one simple app.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nunito.className} bg-gray-50 min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
