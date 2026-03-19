import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow setup and login
  if (pathname === '/login' || pathname === '/setup') {
    return NextResponse.next()
  }

  // Allow auth API routes
  if (pathname.startsWith('/api/auth') || pathname === '/api/setup') {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  const session = await getIronSession<SessionData>(request, response, sessionOptions)

  if (!session.role) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Banker-only routes
  if (pathname.startsWith('/banker') && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  // Customer-only routes
  if (pathname.startsWith('/account') && session.role !== 'customer') {
    return NextResponse.redirect(new URL('/banker', request.url))
  }

  return response
}

export const config = {
  matcher: ['/banker/:path*', '/account/:path*', '/api/:path*'],
}
