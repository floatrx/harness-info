import type { Metadata } from 'next';

import { routing } from '@/i18n/routing';

const ogLocale: Record<string, string> = { uk: 'uk_UA', en: 'en_US' };

interface PageMeta {
  locale: string;
  /** The path after the locale: '' for the home page, or the chapter slug. */
  path: string;
  title: string;
  description: string;
  siteName: string;
}

/** Open Graph, the Twitter card, the canonical link and the hreflang pair for one page in one locale. */
export const pageMetadata = ({ locale, path, title, description, siteName }: PageMeta): Metadata => {
  const href = (target: string) => `/${target}${path ? `/${path}` : ''}`;
  return {
    title,
    description,
    alternates: {
      canonical: href(locale),
      languages: { ...Object.fromEntries(routing.locales.map((item) => [item, href(item)])), 'x-default': href(routing.defaultLocale) },
    },
    openGraph: {
      type: 'website',
      siteName,
      title,
      description,
      url: href(locale),
      locale: ogLocale[locale],
      alternateLocale: routing.locales.filter((item) => item !== locale).map((item) => ogLocale[item]),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
};
