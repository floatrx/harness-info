import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Every path except API routes, Next internals, files with an extension and the extensionless apple-icon route.
  matcher: '/((?!api|_next|_vercel|apple-icon|.*\\..*).*)',
};
