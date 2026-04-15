import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AQI Calc Logo';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function ObjectResource() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0b', // dark surface color
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '240px',
            height: '240px',
            background: 'linear-gradient(to top right, #c44a18, #e86a3a)',
            borderRadius: '40px',
            marginBottom: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="140"
            height="140"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.8 19.6A2 2 0 1 0 14 16H2" />
            <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
            <path d="M9.8 4.4A2 2 0 1 1 11 8H2" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          AQI Calc
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#a1a1aa',
            marginTop: '16px',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Impact Tracker
        </div>
      </div>
    ),
    { ...size }
  );
}
