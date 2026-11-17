import { getTranslations } from 'next-intl/server';

import { CopyPromptButton } from '@/components/home/copy-prompt-button';
import { AuthorLine } from '@/components/shell/author-line';
import { siteConfig } from '@/config/site';

interface Props {
  prompt: string;
}

const steps = ['starterStep1', 'starterStep2', 'starterStep3'] as const;

/** The "build your own" panel: three steps, the copy button, the full prompt on demand, the price and the author. */
export const StarterBanner = async ({ prompt }: Props) => {
  const t = await getTranslations('home');

  return (
    <section
      id="start"
      aria-labelledby="start-title"
      className="mt-7 max-w-[760px] scroll-mt-5 rounded-panel border border-accent-line bg-surface px-4 py-4 min-[900px]:px-5 min-[900px]:py-5"
    >
      <p className="text-[12.5px] font-semibold tracking-[0.04em] text-accent-text uppercase">{t('starterKicker')}</p>
      <h2 id="start-title" className="mt-1 text-[19px] font-semibold tracking-[-0.01em] text-balance text-ink min-[900px]:text-[21px]">
        {t('starterTitle')}
      </h2>
      <p className="mt-1.5 max-w-[66ch] text-[14.5px] leading-normal text-ink-soft">{t('starterLead')}</p>

      <div className="mt-4 flex flex-wrap items-start gap-x-4 gap-y-2">
        <CopyPromptButton prompt={prompt} />
        <p className="max-w-[44ch] pt-2.5 text-[13.5px] leading-snug text-ink-soft">
          <b className="font-semibold text-ink">{t('starterFree')}</b> {t('starterFreeNote')}
        </p>
      </div>

      <ol className="mt-4 grid gap-2 min-[700px]:grid-cols-3">
        {steps.map((key, index) => (
          <li
            key={key}
            className="flex gap-2.5 rounded-card border border-line-soft bg-surface-2 px-3 py-2.5 text-[13.5px] leading-snug text-ink"
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-accent-soft text-[12px] font-bold text-accent-text tabular-nums">
              {index + 1}
            </span>
            <span>{t(key)}</span>
          </li>
        ))}
      </ol>

      <details className="group mt-4 rounded-card border border-line-soft bg-lane">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 text-[13.5px] font-medium text-ink-soft hover:text-ink">
          <span aria-hidden className="text-faint transition-transform group-open:rotate-90">
            ›
          </span>
          {t('starterShow')}
        </summary>
        <pre className="max-h-[420px] overflow-y-auto border-t border-line-soft px-4 py-3 font-mono text-[12.5px] leading-[1.6] [overflow-wrap:anywhere] whitespace-pre-wrap text-ink-soft">
          {prompt}
        </pre>
      </details>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line-soft pt-3.5">
        <AuthorLine />
        <a
          href={siteConfig.demoRepo}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="star-on-github"
          className="inline-flex min-h-11 items-center gap-2 rounded-btn border border-line px-3.5 text-[13.5px] font-medium text-ink transition-colors hover:border-accent-line hover:bg-surface-2"
        >
          <span aria-hidden className="text-accent">
            ★
          </span>
          {t('starterStar')}
        </a>
      </div>
    </section>
  );
};
