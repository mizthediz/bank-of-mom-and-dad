import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Bank of Mom and Dad'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-120px', left: '-60px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', display: 'flex',
        }} />

        {/* Dollar icon badge */}
        <div style={{
          width: '120px', height: '120px', borderRadius: '32px',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '32px',
          border: '2px solid rgba(255,255,255,0.25)',
        }}>
          <span style={{ fontSize: '72px', color: 'white', fontWeight: 900 }}>$</span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: '68px', fontWeight: 900, color: 'white',
          letterSpacing: '-2px', textAlign: 'center', lineHeight: 1.1,
          marginBottom: '20px',
        }}>
          Bank of Mom and Dad
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '28px', color: 'rgba(255,255,255,0.75)',
          textAlign: 'center', maxWidth: '700px', lineHeight: 1.4,
          fontWeight: 500,
        }}>
          A digital piggy bank for kids. Teach real money skills — no real money needed.
        </div>

        {/* Pills */}
        <div style={{
          display: 'flex', gap: '16px', marginTop: '48px',
        }}>
          {['🏦 Allowances', '📈 Interest', '💸 Transactions'].map((label) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '100px', padding: '10px 24px',
              color: 'white', fontSize: '20px', fontWeight: 700,
              display: 'flex',
            }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
