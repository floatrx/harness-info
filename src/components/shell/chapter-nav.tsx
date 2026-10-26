import { getTranslations } from 'next-intl/server';

import { ChapterList } from '@/components/shell/chapter-list';

/** The chapter column next to the rail. */
export const ChapterNav = async () => {
  const t = await getTranslations('nav');
  return (
    <nav
      aria-label={t('guideNav')}
      className="sticky top-0 hidden h-dvh overflow-y-auto border-r border-line-soft px-3 py-[18px] min-[900px]:block"
    >
      <div className="grid gap-0.5 px-2.5 pt-1 pb-4">
        <b className="text-[15px] font-semibold text-ink">{t('guide')}</b>
        <span className="text-[12.5px] text-ink-mute">{t('chaptersMeta')}</span>
      </div>
      <ChapterList />
    </nav>
  );
};
