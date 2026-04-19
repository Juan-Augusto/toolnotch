import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function DefaultOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          background: '#1e293b',
          position: 'relative',
        }}
      >
        {/* Blue accent bar — left edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: '#2563eb',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 80px',
            flex: 1,
          }}
        >
          {/* Logo / brand name */}
          <div
            style={{
              color: '#ffffff',
              fontSize: '80px',
              fontWeight: 'bold',
              lineHeight: 1.1,
              marginBottom: '24px',
              letterSpacing: '-1px',
            }}
          >
            ToolNotch
          </div>

          {/* Tagline */}
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: '32px',
              fontWeight: 'normal',
              lineHeight: 1.4,
            }}
          >
            Free Online Tools. No sign-up. No data stored.
          </div>
        </div>

        {/* Bottom-right domain label */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            color: '#2563eb',
            fontSize: '28px',
            fontWeight: 'bold',
          }}
        >
          toolnotch.com
        </div>
      </div>
    ),
    { ...size }
  )
}
