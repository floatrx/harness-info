'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { LayoutGroup, motion } from 'framer-motion';

import { Actor, type ActorId, Avatar } from '@/components/diagrams/actor';
import { ClaudeSpinner } from '@/components/diagrams/claude-spinner';
import { DiagramFrame } from '@/components/diagrams/diagram-frame';
import { useStepper } from '@/components/diagrams/use-stepper';
import flowData from '@/config/diagrams/flow.json';
import { flow as columns } from '@/config/flow';
import { cn } from '@/lib/cn';

type Step = (typeof flowData.scenarios)[number]['steps'][number] & { bounces?: number; prototype?: string };

/** The home-page board: one task card moving through the thirteen columns, one scripted step at a time. */
export const TaskFlow = () => {
  const t = useTranslations('diagrams');
  const [scenarioId, setScenarioId] = useState(flowData.scenarios[0].id);
  const scenario = flowData.scenarios.find((item) => item.id === scenarioId) ?? flowData.scenarios[0];
  const stepper = useStepper(scenario.steps.length);
  const current = scenario.steps[stepper.step] as Step;
  const previous = scenario.steps[stepper.step - 1] as Step | undefined;

  // Live: an agent unit works the card now. Idle: the loop takes it next. Human gates and finished cards show nothing.
  const liveStatuses = new Set(['spec', 'plan', 'implementing', 'qa', 'judge']);
  const working =
    liveStatuses.has(current.status) || (current.status === 'prototype' && current.prototype === 'drafting')
      ? 'live'
      : current.status === 'ready'
        ? 'idle'
        : null;

  const actorLabel = (actor: string) => (actor === 'human' || actor === 'harness' || actor === 'none' ? t(`actors.${actor}`) : actor);

  const handleScenario = (id: string) => {
    setScenarioId(id);
    stepper.reset();
  };

  const caption = (
    <>
      <span className="mb-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
        {current.actors.map((actor) => (
          <Actor key={actor} actor={actor as ActorId} label={actorLabel(actor)} you={t('actors.youPill')} />
        ))}
        <code className="font-mono text-[13px] text-ink-mute">
          {previous && previous.status !== current.status ? `${previous.status} → ${current.status}` : current.status}
          {current.prototype ? ` · ${current.prototype}` : ''}
        </code>
      </span>
      <span className="block">{t(`flow.steps.${scenario.id}.${current.id}`)}</span>
    </>
  );

  return (
    <DiagramFrame
      label={t('flow.label')}
      scenarios={flowData.scenarios.map((item) => ({ id: item.id, label: t(`flow.scenarios.${item.id}`) }))}
      scenario={scenario.id}
      onScenario={handleScenario}
      stepper={stepper}
      length={scenario.steps.length}
      caption={caption}
    >
      <LayoutGroup id={`flow-${scenario.id}`}>
        <ol className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 lg:grid-cols-7">
          {columns.map(({ status, owner }) => {
            const active = status === current.status;
            return (
              <li
                key={status}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex min-h-[76px] flex-col gap-2 rounded-card border px-1.5 py-[7px] transition-colors duration-300 sm:min-h-[88px]',
                  active ? 'border-line bg-surface-2' : 'border-transparent bg-lane',
                )}
              >
                <span className="flex flex-col items-start gap-[5px]">
                  <code
                    className={cn(
                      'font-mono text-[11px] leading-tight tracking-[-0.01em] break-all',
                      active ? 'font-semibold text-ink' : 'text-ink-mute',
                    )}
                  >
                    {status}
                  </code>
                  <Avatar
                    actor={owner as ActorId}
                    size="sm"
                    you={t('actors.youPill')}
                    className={owner === 'human' ? 'h-[18px] px-[5px] text-[9.5px]' : undefined}
                  />
                </span>
                {active && (
                  <motion.div
                    layoutId="task-card"
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    className={cn(
                      'mt-auto grid gap-1.5 rounded-btn border px-[7px] pt-[7px] pb-1.5',
                      working === 'live'
                        ? 'claude-breathe border-accent-line bg-card-run'
                        : current.status === 'parked'
                          ? 'border-[rgb(255_97_112/0.5)] bg-card'
                          : 'border-[#232323] bg-card',
                    )}
                  >
                    <span className="flex flex-wrap items-center gap-x-[5px] gap-y-[3px] text-[11px]">
                      <span className="font-semibold whitespace-nowrap text-ink tabular-nums">{scenario.task}</span>
                      <span className="rounded-[5px] bg-surface-2 px-[5px] text-ink-mute">{current.prototype ?? scenario.kind}</span>
                    </span>
                    <span className="flex min-h-[18px] items-center gap-1">
                      {current.bounces !== undefined && (
                        <span className="flex gap-[3px]" title={t('flow.bounces', { n: current.bounces })}>
                          {[0, 1].map((dot) => (
                            <i
                              key={dot}
                              className={cn(
                                'size-[7px] rounded-full border-[1.5px] border-danger',
                                dot < (current.bounces ?? 0) && 'bg-danger',
                              )}
                            />
                          ))}
                        </span>
                      )}
                      {working && <ClaudeSpinner state={working} size="sm" className="ml-auto" />}
                    </span>
                  </motion.div>
                )}
              </li>
            );
          })}
        </ol>
      </LayoutGroup>
    </DiagramFrame>
  );
};
