'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';

import { ChapterList } from '@/components/shell/chapter-list';
import { CloseIcon, DemoIcon, ExampleIcon, GithubIcon, HomeIcon, ListIcon } from '@/components/shell/icons';
import { useChapter } from '@/components/shell/use-chapter';
import { siteConfig } from '@/config/site';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

const sheetLink = 'flex min-h-14 flex-col items-center justify-center gap-1 rounded-[9px] bg-surface-2 text-[12.5px] text-ink-mute';

/** Phones: the guide menu and the next step, in thumb reach. */
export const BottomBar = () => {
  const t = useTranslations();
  const { index, isHome, isLost, next, total } = useChapter();
  const sheet = useRef<HTMLDialogElement>(null);
  const close = () => sheet.current?.close();

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line-soft bg-rail px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] min-[900px]:hidden">
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => sheet.current?.showModal()}
          className={cn(
            'flex h-[50px] items-center gap-2 rounded-panel border border-line bg-surface-2 px-3.5 text-[14px] font-semibold whitespace-nowrap text-ink',
            isLost && 'flex-1 justify-center',
          )}
        >
          <ListIcon className="size-[18px] text-ink-mute" />
          {index < 0 ? t('nav.chaptersButton', { total }) : t('doc.chapterOf', { n: index + 1, total })}
        </button>
        {isLost ? null : next ? (
          <Link
            href={`/${next}`}
            data-testid="bottom-next"
            className="flex h-[50px] min-w-0 flex-1 items-center justify-center gap-2 rounded-panel bg-accent px-3.5 text-[15px] font-semibold text-accent-ink"
          >
            {isHome ? (
              <span className="truncate">{t('home.primary')}</span>
            ) : (
              <span className="grid min-w-0 leading-tight">
                <span className="text-[11.5px] font-medium">{t('doc.nextLabel')}</span>
                <span className="truncate">{t(`pages.${next}.title`)}</span>
              </span>
            )}
            →
          </Link>
        ) : (
          <Link
            href="/"
            data-testid="bottom-next"
            className="flex h-[50px] min-w-0 flex-1 items-center justify-center rounded-panel bg-surface-2 px-3.5 text-[15px] font-semibold text-ink"
          >
            ← {t('nav.overview')}
          </Link>
        )}
      </div>
      <dialog
        ref={sheet}
        aria-labelledby="chapter-sheet-title"
        onClick={(event) => event.target === sheet.current && close()}
        className="m-auto mb-0 max-h-[86dvh] w-full max-w-[560px] overflow-y-auto rounded-t-[14px] border border-b-0 border-line bg-surface pb-[calc(12px+env(safe-area-inset-bottom))] text-ink backdrop:bg-black/60"
      >
        <div className="sticky top-0 flex items-center justify-between gap-2.5 bg-surface pt-2.5 pr-2.5 pb-1.5 pl-[18px]">
          <b id="chapter-sheet-title" className="text-[15px]">
            {t('nav.guide')}
            <span className="block text-[12.5px] font-normal text-ink-mute">{t('nav.chaptersMeta')}</span>
          </b>
          <button
            type="button"
            onClick={close}
            aria-label={t('nav.close')}
            className="grid size-11 place-items-center rounded-[9px] bg-surface-2"
          >
            <CloseIcon className="size-[18px]" />
          </button>
        </div>
        <div className="px-2.5 pt-1 pb-2.5">
          <ChapterList large onNavigate={close} />
        </div>
        <div className="grid grid-cols-4 gap-1.5 border-t border-line-soft px-2.5 pt-2.5 pb-1">
          <Link
            href="/"
            onClick={close}
            aria-current={isHome ? 'page' : undefined}
            className={cn(sheetLink, isHome && 'bg-accent-soft text-accent')}
          >
            <HomeIcon className="size-[18px]" />
            {t('nav.overview')}
          </Link>
          <a href={siteConfig.demoRepo} target="_blank" rel="noopener noreferrer" className={sheetLink}>
            <DemoIcon className="size-[18px]" />
            {t('nav.demo')}
          </a>
          <a href={siteConfig.exampleRepo} target="_blank" rel="noopener noreferrer" className={sheetLink}>
            <ExampleIcon className="size-[18px]" />
            {t('nav.example')}
          </a>
          <a href={siteConfig.repo} target="_blank" rel="noopener noreferrer" className={sheetLink}>
            <GithubIcon className="size-[18px]" />
            {t('nav.github')}
          </a>
        </div>
      </dialog>
    </>
  );
};
