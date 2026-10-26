import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** The home-screen icon: the harness mark on the site's ground colour; iOS rounds the corners itself. */
export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d' }}>
      <svg width="124" height="124" viewBox="0 0 22 22">
        <path d="M5 11a6 6 0 1 1 6 6" fill="none" stroke="#d97757" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="11" cy="11" r="2.4" fill="#d97757" />
        <circle cx="5" cy="17" r="1.6" fill="#d97757" />
      </svg>
    </div>,
    size,
  );
}
