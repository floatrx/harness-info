'use client';

import type { ReactNode } from 'react';
import type { Stepper } from '@/components/diagrams/use-stepper';

import { useTranslations } from 'next-intl';

import { Track } from '@/components/shell/track';
import { cn } from '@/lib/cn';

interface Scenario {
  id: string;
  label: string;
}

interface Props {
  label: string;
  scenarios?: Scenario[];
  scenario?: string;
  onScenario?: (id: string) => void;
  stepper: Stepper;
  length: number;
  caption: ReactNode;
  children: ReactNode;
  className?: string;
}

const stepButton =
  'grid h-9 w-10 place-items-center rounded-btn border border-line bg-surface-2 text-ink transition-[background-color,transform] hover:bg-surface-3 active:scale-95 disabled:opacity-40 disabled:active:scale-100 max-[899px]:h-11 max-[899px]:w-12';

/** The dashboard panel every scripted diagram sits in: title, scenario switch, picture, caption and step controls. */
export const DiagramFrame = ({ label, scenarios, scenario, onScenario, stepper, length, caption, children, className }: Props) => {
  const t = useTranslations('diagrams.controls');

  return (
    <figure
      data-ui
      aria-label={label}
      className={cn('not-prose my-4 mb-6 rounded-panel border border-line-soft bg-surface p-3 sm:px-3.5 sm:pt-3 sm:pb-3.5', className)}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
        <span className="text-[13px] font-semibold text-ink">{label}</span>
        {scenarios && scenarios.length > 1 && (
          <div role="radiogroup" aria-label={t('scenario')} className="flex flex-wrap gap-1 rounded-[9px] bg-rail p-[3px]">
            {scenarios.map((item) => {
              const active = item.id === scenario;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onScenario?.(item.id)}
                  className={cn(
                    'h-[30px] rounded-btn px-[11px] text-[12.5px] transition-colors max-[899px]:h-11 max-[899px]:px-3 max-[899px]:text-[13px]',
                    active
                      ? 'bg-surface-2 font-semibold text-ink shadow-[inset_0_0_0_1px_var(--color-line)]'
                      : 'font-medium text-ink-mute hover:text-ink',
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>{children}</div>

      <figcaption
        aria-live="polite"
        className="mt-3 min-h-[104px] rounded-card border border-[#232323] bg-card px-3.5 py-3 text-[15px] leading-[1.55] text-ink"
      >
        {caption}
      </figcaption>

      <div className="mt-3 flex items-center gap-2.5">
        <button type="button" onClick={stepper.prev} disabled={stepper.step === 0} aria-label={t('prev')} className={stepButton}>
          ←
        </button>
        <button type="button" onClick={stepper.next} disabled={stepper.atEnd} aria-label={t('next')} className={stepButton}>
          →
        </button>
        <button
          type="button"
          onClick={stepper.toggle}
          aria-label={stepper.playing ? t('pause') : stepper.atEnd ? t('replay') : t('play')}
          className="h-9 rounded-btn bg-accent-soft px-3 text-[13px] font-semibold text-accent transition-colors hover:bg-[rgb(217_119_87/0.22)] max-[899px]:h-11"
        >
          {stepper.playing ? t('pause') : stepper.atEnd ? t('replay') : t('play')}
        </button>
        <span className="min-w-[84px] text-[12.5px] text-ink-mute tabular-nums">{t('goTo', { n: stepper.step + 1, total: length })}</span>
        <ol className="flex min-w-0 flex-1 gap-[3px]">
          {Array.from({ length }, (_, index) => (
            <li key={index} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => stepper.goTo(index)}
                aria-label={t('goTo', { n: index + 1, total: length })}
                aria-current={index === stepper.step ? 'step' : undefined}
                className="flex h-6 w-full items-center"
              >
                <span
                  className={cn(
                    'block h-[3px] w-full rounded-full',
                    index === stepper.step ? 'bg-accent' : index < stepper.step ? 'bg-track-past' : 'bg-track',
                  )}
                />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
};

export { Track };
