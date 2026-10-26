'use client';

import type { ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import { DemoIcon, ExternalIcon, GithubIcon, GuideIcon, HomeIcon, MarkIcon } from '@/components/shell/icons';
import { useChapter } from '@/components/shell/use-chapter';
import { docSlugs } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

const item =
  'group relative flex min-h-11 w-11 flex-col items-center justify-center gap-1 rounded-[9px] text-[12px] font-medium text-ink-mute transition-colors hover:bg-surface hover:text-ink min-[1240px]:min-h-[54px] min-[1240px]:w-[62px]';

/** Visible label on wide screens; a hover tip when the rail narrows. */
const Label = ({ text, tip }: { text: string; tip: string }) => (
  <>
    <span className="hidden min-[1240px]:block">{text}</span>
    <span className="pointer-events-none absolute top-1/2 left-[calc(100%+10px)] z-10 hidden -translate-y-1/2 rounded-md border border-line bg-surface-2 px-2.5 py-1 text-[12.5px] whitespace-nowrap text-ink group-hover:block group-focus-visible:block min-[1240px]:group-hover:hidden">
      {tip}
    </span>
  </>
);

const External = ({ href, icon, text, tip }: { href: string; icon: ReactNode; text: string; tip: string }) => (
  <a className={item} href={href} target="_blank" rel="noopener noreferrer">
    {icon}
    <ExternalIcon className="absolute top-2 right-2 size-2 opacity-55" />
    <Label text={text} tip={tip} />
  </a>
);

/** The site rail, as on the dashboard: the mark, the overview, the guide, then the outside links. */
export const Rail = () => {
  const t = useTranslations('nav');
  const { isHome, slug } = useChapter();

  return (
    <nav
      aria-label={t('siteNav')}
      className="sticky top-0 hidden h-dvh flex-col items-center gap-1 border-r border-line-soft bg-rail pt-3.5 pb-4 min-[900px]:flex"
    >
      <Link href="/" aria-label="harness info" className="mb-2.5 grid size-11 place-items-center rounded-[9px] text-accent">
        <MarkIcon />
      </Link>
      <Link
        href="/"
        aria-current={isHome ? 'page' : undefined}
        className={cn(item, isHome && 'bg-accent-soft text-accent hover:bg-accent-soft hover:text-accent')}
      >
        <HomeIcon className="size-[19px]" />
        <Label text={t('overview')} tip={t('overview')} />
      </Link>
      <Link
        href={`/${docSlugs[0]}`}
        aria-current={slug ? 'true' : undefined}
        className={cn(item, slug && 'bg-accent-soft text-accent hover:bg-accent-soft hover:text-accent')}
      >
        <GuideIcon className="size-[19px]" />
        <Label text={t('guide')} tip={t('chaptersMeta')} />
      </Link>
      <span aria-hidden className="mt-auto mb-1.5 w-8 border-t border-line-soft" />
      <External href={siteConfig.demoRepo} icon={<DemoIcon className="size-[19px]" />} text={t('demo')} tip={t('demoTip')} />
      <External href={siteConfig.repo} icon={<GithubIcon className="size-[19px]" />} text={t('github')} tip={t('githubTip')} />
    </nav>
  );
};
