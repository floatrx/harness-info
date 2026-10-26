import { notFound } from 'next/navigation';

import { docSlugs, isDocSlug } from '@/config/navigation';
import { routing } from '@/i18n/routing';
import { renderCard } from '@/lib/og/card';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'harness info';

export const generateStaticParams = () => routing.locales.flatMap((locale) => docSlugs.map((slug) => ({ locale, slug })));

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

/** The share card of a chapter, one per chapter and locale. */
export default async function OpenGraphImage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isDocSlug(slug)) notFound();
  return renderCard(locale, slug);
}
