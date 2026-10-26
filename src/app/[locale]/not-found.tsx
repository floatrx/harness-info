import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <main id="content" className="min-w-0 px-4 py-24 min-[900px]:px-11">
      <h1 className="text-[30px] font-semibold tracking-tight text-ink">{t('title')}</h1>
      <Link href="/" className="mt-6 inline-flex h-10 items-center rounded-btn bg-accent px-[18px] font-semibold text-accent-ink">
        {t('back')}
      </Link>
    </main>
  );
}
