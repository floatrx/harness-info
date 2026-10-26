import type { MetadataRoute } from 'next';

import { siteUrl } from '@/lib/site-url';

/** The whole guide is public; the share-card and icon routes need no indexing rules of their own. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
    host: siteUrl.origin,
  };
}
