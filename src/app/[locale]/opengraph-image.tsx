import { routing } from '@/i18n/routing';
import { renderCard } from '@/lib/og/card';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'harness info';

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

interface Props {
  params: Promise<{ locale: string }>;
}

/** The share card of the home page, one per locale. */
export default async function OpenGraphImage({ params }: Props) {
  const { locale } = await params;
  return renderCard(locale, null);
}
