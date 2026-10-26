import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['uk', 'en'],
  // English for anyone whose browser asks for neither language, and for crawlers and link previews (user, 2026-10-26).
  // A Ukrainian browser still lands on /uk through Accept-Language.
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
