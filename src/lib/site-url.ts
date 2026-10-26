/**
 * The public origin for absolute URLs (Open Graph images, canonical and hreflang links).
 * Set NEXT_PUBLIC_SITE_URL on deploy; Vercel provides its production host on its own; a local build points to the dev port.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3012'),
);
