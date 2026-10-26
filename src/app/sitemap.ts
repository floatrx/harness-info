import type { MetadataRoute } from 'next';

import { docSlugs } from '@/config/navigation';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site-url';

const pathsAfterLocale = ['', ...docSlugs];

const absolute = (locale: string, path: string) => new URL(`/${locale}${path ? `/${path}` : ''}`, siteUrl).toString();

/** Every page in every locale, each listing its language pair; the same pairs as the hreflang links in the page head. */
export default function sitemap(): MetadataRoute.Sitemap {
  return pathsAfterLocale.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: absolute(locale, path),
      priority: path ? 0.8 : 1,
      alternates: {
        languages: {
          ...Object.fromEntries(routing.locales.map((item) => [item, absolute(item, path)])),
          'x-default': absolute(routing.defaultLocale, path),
        },
      },
    })),
  );
}
