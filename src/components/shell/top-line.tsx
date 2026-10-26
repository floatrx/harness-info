'use client';

import { useTranslations } from 'next-intl';

import { LocaleSwitch } from '@/components/layout/locale-switch';
import { MarkIcon } from '@/components/shell/icons';
import { Track } from '@/components/shell/track';
import { useChapter } from '@/components/shell/use-chapter';
import { docSlugs } from '@/config/navigation';
import { Link } from '@/i18n/navigation';

/** The breadcrumb line above every page; on narrow screens it also carries the mark and the guide track. */
export const TopLine = () => {
  const t = useTranslations();
  const { slug, index, isHome, total } = useChapter();

  return (
    <header className="mb-7 flex min-h-9 items-center gap-3 text-[13.5px] max-[899px]:sticky max-[899px]:top-0 max-[899px]:z-20 max-[899px]:-mx-4 max-[899px]:mb-5 max-[899px]:min-h-[52px] max-[899px]:flex-wrap max-[899px]:gap-x-2 max-[899px]:gap-y-1 max-[899px]:border-b max-[899px]:border-line-soft max-[899px]:bg-rail max-[899px]:px-1.5 max-[899px]:pt-1">
      <Link href="/" aria-label="harness info" className="hidden size-11 place-items-center rounded-[9px] text-accent max-[899px]:grid">
        <MarkIcon />
      </Link>
      <nav
        aria-label={t('nav.whereAmI')}
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-mute max-[899px]:text-[14px] min-[900px]:shrink-0"
      >
        <Link
          href="/"
          className="text-[14.5px] font-semibold text-ink max-[899px]:-mx-1.5 max-[899px]:inline-flex max-[899px]:min-h-11 max-[899px]:items-center max-[899px]:px-1.5"
        >
          harness info
        </Link>
        <span aria-hidden className="text-faint">
          ›
        </span>
        {isHome ? (
          <span aria-current="page" className="text-ink">
            {t('nav.overview')}
          </span>
        ) : (
          <>
            <Link
              href={`/${docSlugs[0]}`}
              className="hover:text-ink max-[899px]:-mx-1.5 max-[899px]:inline-flex max-[899px]:min-h-11 max-[899px]:items-center max-[899px]:px-1.5"
            >
              {t('nav.guide')}
            </Link>
            <span aria-hidden className="text-faint max-[899px]:hidden">
              ›
            </span>
            <span aria-current="page" className="text-ink max-[899px]:hidden">
              {t(`pages.${slug}.title`)}
            </span>
          </>
        )}
      </nav>
      <div className="ml-auto">
        <LocaleSwitch />
      </div>
      {!isHome && (
        <div
          className="hidden basis-full px-2.5 pb-2 max-[1239px]:block min-[900px]:max-[1239px]:px-0 min-[900px]:max-[1239px]:pb-0"
          title={t('doc.chapterOf', { n: index + 1, total })}
        >
          <Track total={total} at={index} height={4} />
        </div>
      )}
    </header>
  );
};
