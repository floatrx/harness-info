import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { TaskFlow } from '@/components/diagrams/task-flow';
import { GoalLine } from '@/components/doc/goal-line';
import { Dock } from '@/components/shell/dock';
import { TopLine } from '@/components/shell/top-line';
import { docSlugs } from '@/config/navigation';
import { Link } from '@/i18n/navigation';
import { pageMetadata } from '@/lib/metadata';

interface Props {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({ locale, path: '', title: t('home.title'), description: t('site.description'), siteName: t('site.name') });
};

export default async function HomePage() {
  const t = await getTranslations();
  const headings = [
    { id: 'what', text: t('home.tocWhat') },
    { id: 'read', text: t('home.readTitle') },
    { id: 'flow', text: t('home.flowTitle') },
  ];

  return (
    <>
      <main id="content" className="min-w-0 px-4 pb-28 min-[900px]:px-11 min-[900px]:pt-4 min-[900px]:pb-[72px]">
        <TopLine />
        <section aria-labelledby="what" className="max-w-[720px]">
          <h1
            id="what"
            className="scroll-mt-5 text-[26px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance text-ink min-[900px]:text-[30px]"
          >
            {t('home.title')}
          </h1>
          <GoalLine label={t('doc.goalShort')} text={t('home.goal')} />
          <p className="mt-4 max-w-[66ch] text-[16px] leading-relaxed text-ink">{t('home.lead')}</p>
          <div className="mt-5 hidden flex-wrap gap-2.5 min-[900px]:flex">
            <Link
              href={`/${docSlugs[0]}`}
              className="inline-flex h-10 items-center gap-2 rounded-btn bg-accent px-[18px] text-[14.5px] font-semibold text-accent-ink transition-[background-color,transform] hover:bg-accent-hover active:scale-[0.97]"
            >
              {t('home.primary')} →
            </Link>
            <Link
              href="/quickstart"
              className="inline-flex h-10 items-center rounded-btn border border-line px-3.5 text-[13.5px] font-medium text-ink transition-colors hover:bg-surface-2"
            >
              {t('home.secondary')}
            </Link>
          </div>
        </section>

        <section aria-labelledby="read" className="mt-9 max-w-[760px]">
          <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="read" className="scroll-mt-5 text-[19px] font-semibold tracking-[-0.01em] text-ink">
              {t('home.readTitle')}
            </h2>
            <p className="text-[14px] text-ink-mute">{t('home.readLead')}</p>
          </div>
          <ol className="grid gap-1">
            {docSlugs.map((slug, index) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  className="grid grid-cols-[26px_minmax(0,1fr)_14px] items-start gap-x-3 gap-y-0.5 rounded-card border border-line-soft bg-surface py-2.5 pr-3 pl-2.5 transition-colors hover:border-line hover:bg-surface-2 min-[900px]:grid-cols-[26px_150px_minmax(0,1fr)_16px] min-[900px]:items-center min-[900px]:py-1.5 min-[900px]:pr-3.5"
                >
                  <span className="row-span-2 grid size-6 place-items-center rounded-md bg-surface-2 text-[12px] font-bold text-ink-mute tabular-nums min-[900px]:row-span-1">
                    {index + 1}
                  </span>
                  <span className="text-[14.5px] font-semibold text-ink">{t(`pages.${slug}.title`)}</span>
                  <span aria-hidden className="row-span-2 self-center text-faint min-[900px]:order-last min-[900px]:row-span-1">
                    →
                  </span>
                  <span className="col-start-2 text-[13.5px] leading-snug text-ink-mute min-[900px]:col-start-auto">
                    {t(`pages.${slug}.goal`)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="flow" className="mt-9 max-w-[960px]">
          <h2 id="flow" className="scroll-mt-5 text-[19px] font-semibold tracking-[-0.01em] text-ink">
            {t('home.flowTitle')}
          </h2>
          <p className="mt-1.5 max-w-[720px] text-[14px] text-ink-mute">{t('home.flowLead')}</p>
          <TaskFlow />
        </section>
      </main>
      <Dock slug={null} headings={headings} />
    </>
  );
}
