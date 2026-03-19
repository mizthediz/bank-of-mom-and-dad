import { NextResponse } from 'next/server'

// The single-admin setup flow has been replaced by the multi-banker signup system.
// Bankers now create their accounts at /signup.

export async function GET() {
  return NextResponse.json({ setupRequired: false, message: 'Use /signup to create a banker account.' })
}

export async function POST() {
  return NextResponse.json(
    { error: 'Setup is no longer required. Use /signup to create a banker account.' },
    { status: 410 }
  )
}
