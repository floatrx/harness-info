'use client';

import type { ReactNode } from 'react';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { AnimatePresence, motion } from 'framer-motion';

import { ClaudeSpinner } from '@/components/diagrams/claude-spinner';
import { DiagramFrame } from '@/components/diagrams/diagram-frame';
import { useStepper } from '@/components/diagrams/use-stepper';
import loopData from '@/config/diagrams/loop.json';
import { cn } from '@/lib/cn';

type Layer = 'supervisor' | 'runner' | 'coordinator' | 'specialists' | 'contracts';
type Step = (typeof loopData.scenarios)[number]['steps'][number] & { danger?: boolean };
type Unit = { n: number; task: string; stage: string; code?: number };

const signalFiles = new Set(['PAUSE', 'STOP']);

const codeColor = (code: number) =>
  code === 0
    ? 'var(--color-role-qa)'
    : code === 1
      ? 'var(--color-danger)'
      : code === 4
        ? 'var(--color-role-implementer)'
        : 'var(--color-ink-mute)';

/** The loop as nested layers, the units it ran and the files it keeps in `.harness/trace/`. */
export const LoopAnatomy = () => {
  const t = useTranslations('diagrams.loop');
  const [scenarioId, setScenarioId] = useState(loopData.scenarios[0].id);
  const scenario = loopData.scenarios.find((item) => item.id === scenarioId) ?? loopData.scenarios[0];
  const stepper = useStepper(scenario.steps.length);
  const step = scenario.steps[stepper.step] as Step;
  const active = step.layer as Layer;

  const handleScenario = (id: string) => {
    setScenarioId(id);
    stepper.reset();
  };

  return (
    <DiagramFrame
      label={t('label')}
      scenarios={loopData.scenarios.map((item) => ({ id: item.id, label: t(`scenarios.${item.id}`) }))}
      scenario={scenario.id}
      onScenario={handleScenario}
      stepper={stepper}
      length={scenario.steps.length}
      caption={t(`steps.${scenario.id}.${step.id}`)}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Box
          layer="supervisor"
          active={active}
          danger={step.danger}
          aside={<StateBadge state={step.state} label={t(`states.${step.state}`)} />}
        >
          <Box layer="runner" active={active} danger={step.danger}>
            <Box layer="coordinator" active={active} danger={step.danger}>
              <Box layer="specialists" active={active} danger={step.danger} />
            </Box>
            <Box layer="contracts" active={active} danger={step.danger} />
          </Box>
        </Box>

        <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <section className="rounded-lg bg-surface-2 p-3">
            <h4 className="mb-2 text-sm font-semibold text-ink">{t('units')}</h4>
            <ol className="flex flex-col gap-1">
              <AnimatePresence initial={false}>
                {(step.units as Unit[]).map((unit) => (
                  <motion.li
                    key={unit.n}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 rounded-md bg-surface-3 px-2.5 py-1.5 text-[13px]"
                  >
                    <span className="text-ink-soft">{t('unit', { n: unit.n })}</span>
                    <code className="font-mono text-ink">
                      {unit.task} {unit.stage}
                    </code>
                    {unit.code === undefined ? (
                      <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold">
                        <ClaudeSpinner size="sm" />
                        <span className="claude-shimmer">{t('running')}</span>
                      </span>
                    ) : (
                      <span className="ml-auto font-mono text-xs font-semibold" style={{ color: codeColor(unit.code) }}>
                        exit {unit.code}
                      </span>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          </section>
          <section className="rounded-lg bg-surface-2 p-3">
            <h4 className="mb-2 font-mono text-sm font-semibold text-ink">.harness/trace/</h4>
            <ul className="flex flex-col gap-0.5">
              <AnimatePresence initial={false}>
                {step.files.map((file) => (
                  <motion.li
                    key={file}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className={cn(
                      'rounded px-2 py-1 font-mono text-[13px]',
                      signalFiles.has(file) ? 'bg-accent-soft font-semibold text-accent' : 'text-ink-soft',
                    )}
                  >
                    {file}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </section>
        </div>
      </div>
    </DiagramFrame>
  );
};

interface BoxProps {
  layer: Layer;
  active: Layer;
  danger?: boolean;
  aside?: ReactNode;
  children?: ReactNode;
}

const Box = ({ layer, active, danger, aside, children }: BoxProps) => {
  const t = useTranslations('diagrams.loop');
  const isActive = layer === active;
  const tone = layer === 'supervisor' || layer === 'coordinator' ? 'bg-surface-2' : 'bg-surface-3';

  return (
    <div
      className={cn('relative rounded-lg p-2.5 transition-colors duration-300 sm:p-3', isActive ? 'bg-ink/12' : tone)}
      style={isActive ? { boxShadow: `inset 3px 0 0 ${danger ? 'var(--color-danger)' : 'var(--color-accent)'}` } : undefined}
    >
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className={cn('text-sm font-semibold', isActive ? 'text-ink' : 'text-ink-soft')}>{t(`layers.${layer}`)}</span>
        <span className="text-xs text-ink-mute">{t(`layerNotes.${layer}`)}</span>
        {aside && <span className="ml-auto">{aside}</span>}
      </div>
      {children ? <div className="flex flex-col gap-2">{children}</div> : <div className="h-3" />}
    </div>
  );
};

const StateBadge = ({ state, label }: { state: string; label: string }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
      state === 'running' ? 'bg-accent-soft text-accent' : 'bg-surface-3 text-ink',
    )}
  >
    {state === 'running' ? (
      <ClaudeSpinner size="sm" />
    ) : (
      <span aria-hidden className={cn('size-1.5 rounded-full', state === 'stopped' ? 'bg-danger' : 'bg-ink-soft')} />
    )}
    {label}
  </span>
);
