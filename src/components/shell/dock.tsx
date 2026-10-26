import type { Heading } from '@/lib/content';

import { getTranslations } from 'next-intl/server';

import { Toc } from '@/components/doc/toc';
import { Track } from '@/components/shell/track';
import { type DocSlug, docSlugs } from '@/config/navigation';
import { Link } from '@/i18n/navigation';

interface Props {
  /** The current chapter, or null on the home page. */
  slug: DocSlug | null;
  headings: Heading[];
}

const Title = ({ children }: { children: string }) => <h2 className="mb-1.5 text-[12px] font-semibold text-ink-mute">{children}</h2>;

/** The right column: where you are in the guide, what this page is for, its sections, and what comes next. */
export const Dock = async ({ slug, headings }: Props) => {
  const t = await getTranslations();
  const total = docSlugs.length;
  const index = slug ? docSlugs.indexOf(slug) : -1;
  const next = slug ? (docSlugs[index + 1] ?? null) : docSlugs[0];
  const prev = slug && index > 0 ? docSlugs[index - 1] : null;

  return (
    <aside
      aria-label={t('doc.dockLabel')}
      className="sticky top-0 hidden h-dvh flex-col gap-[22px] overflow-y-auto border-l border-line-soft bg-rail px-[18px] pt-5 pb-[18px] min-[1240px]:flex"
    >
      <section>
        <Title>{t('nav.guide')}</Title>
        <p className="mb-2.5 text-[18px] font-semibold tracking-[-0.01em] text-ink">
          {slug ? t('doc.chapterOf', { n: index + 1, total }) : t('nav.overview')}
          {!slug && (
            <span className="mt-0.5 block text-[13px] font-medium tracking-normal text-ink-mute">{t('doc.beforeFirst', { total })}</span>
          )}
        </p>
        <Track total={total} at={index} />
      </section>
      <section>
        <Title>{t('doc.goalTitle')}</Title>
        <p className="text-[13.5px] leading-normal text-ink">{slug ? t(`pages.${slug}.goal`) : t('home.goal')}</p>
      </section>
      {headings.length > 1 && (
        <nav aria-label={t('doc.onThisPage')}>
          <Title>{t('doc.onThisPage')}</Title>
          <Toc headings={headings} />
        </nav>
      )}
      <section className="mt-auto">
        <Title>{slug ? t('doc.nextLabel') : t('doc.startHere')}</Title>
        {next ? (
          <Link
            href={`/${next}`}
            data-testid="dock-next"
            className="grid gap-[3px] rounded-panel border border-line-soft bg-surface px-3.5 pt-3 pb-3.5 transition-colors hover:border-line"
          >
            <span className="text-[12px] text-ink-mute">{t('doc.chapterOf', { n: docSlugs.indexOf(next) + 1, total })}</span>
            <span className="text-[15.5px] font-semibold text-ink">{t(`pages.${next}.title`)}</span>
            <span className="mb-2.5 text-[12.5px] leading-snug text-ink-mute">{t(`pages.${next}.goal`)}</span>
            <span
              className={
                slug
                  ? 'inline-flex h-10 items-center justify-center rounded-btn bg-accent px-4 text-[14.5px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover'
                  : 'inline-flex h-9 items-center justify-center rounded-btn bg-accent-soft px-3.5 text-[13.5px] font-semibold text-accent'
              }
            >
              {slug ? t('doc.nextTo', { title: t(`pages.${next}.title`) }) : t('doc.openFirst')} →
            </span>
          </Link>
        ) : (
          <Link href="/" className="text-[13px] text-ink-mute hover:text-ink">
            ← {t('nav.overview')}
          </Link>
        )}
        {prev && (
          <Link href={`/${prev}`} className="mt-1.5 flex min-h-8 items-center gap-1.5 px-0.5 text-[12.5px] text-ink-mute hover:text-ink">
            ← {t('doc.backTo', { title: t(`pages.${prev}.title`) })}
          </Link>
        )}
      </section>
    </aside>
  );
};
