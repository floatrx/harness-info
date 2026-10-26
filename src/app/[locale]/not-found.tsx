import { getTranslations } from 'next-intl/server';

import { ChapterList } from '@/components/shell/chapter-list';
import { Link } from '@/i18n/navigation';

/** The localized 404, inside the shell: one way back, and on phones the chapter list (wider screens show it on the left). */
export default async function NotFound() {
  const t = await getTranslations();
  return (
    <main id="content" className="min-w-0 px-4 pt-16 pb-28 min-[900px]:px-11 min-[900px]:py-24">
      <h1 className="text-[30px] font-semibold tracking-tight text-ink">{t('notFound.title')}</h1>
      <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">{t('notFound.lead')}</p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-btn bg-accent px-[18px] text-[14.5px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
      >
        {t('notFound.back')} →
      </Link>
      <nav aria-label={t('nav.guideNav')} className="mt-10 min-[900px]:hidden">
        <ChapterList large />
      </nav>
    </main>
  );
}
