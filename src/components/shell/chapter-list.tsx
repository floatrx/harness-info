'use client';

import { useTranslations } from 'next-intl';

import { useChapter } from '@/components/shell/use-chapter';
import { docSlugs } from '@/config/navigation';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

interface Props {
  large?: boolean;
  onNavigate?: () => void;
}

/** The numbered chapters of the guide, with the current one marked. */
export const ChapterList = ({ large, onNavigate }: Props) => {
  const t = useTranslations();
  const { index } = useChapter();

  return (
    <ol className="grid gap-0.5">
      {docSlugs.map((slug, position) => {
        const current = position === index;
        return (
          <li key={slug}>
            <Link
              href={`/${slug}`}
              onClick={onNavigate}
              title={t(`pages.${slug}.goal`)}
              aria-current={current ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2.5 transition-colors',
                large ? 'min-h-12 text-[15px]' : 'min-h-10 text-[14px]',
                current ? 'bg-accent-soft font-semibold text-accent' : 'text-ink hover:bg-surface',
              )}
            >
              <span
                className={cn(
                  'grid size-[22px] shrink-0 place-items-center rounded-md text-[11.5px] font-bold tabular-nums',
                  current ? 'bg-accent text-accent-ink' : position < index ? 'bg-surface-2 text-faint' : 'bg-surface-2 text-ink-mute',
                )}
              >
                {position + 1}
              </span>
              <span className="min-w-0 leading-tight">{t(`pages.${slug}.title`)}</span>
              {current && <span className="ml-auto text-[11.5px] font-semibold whitespace-nowrap">{t('nav.here')}</span>}
            </Link>
          </li>
        );
      })}
    </ol>
  );
};
