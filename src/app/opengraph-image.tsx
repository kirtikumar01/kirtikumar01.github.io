import { ImageResponse } from 'next/og'

export const dynamic = "force-static"
export const alt = 'Kirti Kumar Piplaj - Frontend Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a2e)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <div
            style={{
              fontSize: 100,
              fontWeight: 800,
              background: 'linear-gradient(to right, #3B82F6, #EC4899)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.05em',
            }}
          >
            Kirti
          </div>
          <div style={{ fontSize: 100, fontWeight: 800, color: '#EC4899' }}>.</div>
        </div>
        <div style={{ fontSize: 60, fontWeight: 700, color: '#ffffff', marginBottom: 20 }}>
          Kirti Kumar Piplaj
        </div>
        <div style={{ fontSize: 40, color: '#9CA3AF' }}>
          Frontend Engineer
        </div>
      </div>
    ),
    { ...size }
  )
}
