import type { DocSlug } from '@/config/navigation';

import { getTranslations } from 'next-intl/server';

import { docSlugs, getNeighbours } from '@/config/navigation';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

interface Props {
  slug: DocSlug;
}

const card =
  'grid min-h-14 gap-0.5 rounded-panel border border-line-soft bg-surface px-3.5 py-3 transition-colors hover:border-line min-[900px]:min-h-16';

export const Pager = async ({ slug }: Props) => {
  const t = await getTranslations();
  const { prev, next } = getNeighbours(slug);
  const total = docSlugs.length;

  return (
    <nav aria-label={t('nav.guide')} className="mt-14 grid gap-2.5 min-[900px]:grid-cols-2">
      {prev ? (
        <Link href={`/${prev}`} className={card}>
          <span className="text-[12px] text-ink-mute">← {t('doc.prevChapter', { n: docSlugs.indexOf(prev) + 1, total })}</span>
          <span className="text-[15px] font-semibold text-ink">{t(`pages.${prev}.title`)}</span>
        </Link>
      ) : (
        <Link href="/" className={card}>
          <span className="text-[12px] text-ink-mute">← {t('doc.previous')}</span>
          <span className="text-[15px] font-semibold text-ink">{t('nav.overview')}</span>
        </Link>
      )}
      {next && (
        <Link href={`/${next}`} className={cn(card, 'min-[900px]:text-right')}>
          <span className="text-[12px] text-ink-mute">{t('doc.nextChapter', { n: docSlugs.indexOf(next) + 1, total })} →</span>
          <span className="text-[15px] font-semibold text-accent">{t(`pages.${next}.title`)}</span>
        </Link>
      )}
    </nav>
  );
};
