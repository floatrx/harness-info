import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { GoalLine } from '@/components/doc/goal-line';
import { MobileToc } from '@/components/doc/mobile-toc';
import { Pager } from '@/components/doc/pager';
import { Dock } from '@/components/shell/dock';
import { TopLine } from '@/components/shell/top-line';
import { docSlugs, isDocSlug } from '@/config/navigation';
import { routing } from '@/i18n/routing';
import { getHeadings } from '@/lib/content';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export const generateStaticParams = () => routing.locales.flatMap((locale) => docSlugs.map((slug) => ({ locale, slug })));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale, slug } = await params;
  if (!isDocSlug(slug)) return {};
  const t = await getTranslations({ locale });
  return {
    title: `${t(`pages.${slug}.title`)} · ${t('doc.chapterOf', { n: docSlugs.indexOf(slug) + 1, total: docSlugs.length })}`,
    description: t(`pages.${slug}.goal`),
  };
};

export default async function DocPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isDocSlug(slug)) notFound();

  const t = await getTranslations();
  const headings = await getHeadings(locale, slug);
  const { default: Content } = await import(`@/content/${locale}/${slug}.mdx`);

  return (
    <>
      <main id="content" className="min-w-0 px-4 pb-28 min-[900px]:px-11 min-[900px]:pt-4 min-[900px]:pb-[72px]">
        <TopLine />
        <header className="max-w-[720px]">
          <h1 className="text-[26px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance text-ink min-[900px]:text-[30px]">
            {t(`pages.${slug}.title`)}
          </h1>
          <GoalLine label={t('doc.goalShort')} text={t(`pages.${slug}.goal`)} />
        </header>
        {headings.length > 1 && (
          <div className="mt-6 max-w-[720px] min-[1240px]:hidden">
            <MobileToc headings={headings} title={t('doc.onThisPage')} />
          </div>
        )}
        <article className="mt-9 max-w-[720px]">
          <Content />
        </article>
        <div className="max-w-[720px]">
          <Pager slug={slug} />
        </div>
      </main>
      <Dock slug={slug} headings={headings} />
    </>
  );
}
