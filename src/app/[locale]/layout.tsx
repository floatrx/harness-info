import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { Geist_Mono, Onest } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { BottomBar } from '@/components/shell/bottom-bar';
import { ChapterNav } from '@/components/shell/chapter-nav';
import { Rail } from '@/components/shell/rail';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site-url';
import { AppProviders } from '@/providers/app-providers';

import '@/styles/global.css';

const onest = Onest({ variable: '--font-onest', subsets: ['latin', 'cyrillic'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin', 'cyrillic'] });

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export const generateMetadata = async ({ params }: Omit<Props, 'children'>): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  return {
    metadataBase: siteUrl,
    title: { default: t('name'), template: `%s · ${t('name')}` },
    description: t('description'),
  };
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d0d0d',
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'nav' });

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className={`${onest.variable} ${geistMono.variable} font-sans antialiased`}>
        <NextIntlClientProvider>
          <AppProviders>
            <a
              href="#content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink"
            >
              {t('skip')}
            </a>
            <div className="min-h-dvh min-[900px]:grid min-[900px]:grid-cols-[var(--rail-w)_var(--nav-w)_minmax(0,1fr)] min-[1240px]:grid-cols-[var(--rail-w)_var(--nav-w)_minmax(0,1fr)_var(--dock-w)]">
              <Rail />
              <ChapterNav />
              {children}
            </div>
            <BottomBar />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
