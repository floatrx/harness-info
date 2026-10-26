'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { Actor, actorColor, type ActorId, Avatar, isRole } from '@/components/diagrams/actor';
import { DiagramFrame } from '@/components/diagrams/diagram-frame';
import { useStepper } from '@/components/diagrams/use-stepper';
import sequenceData from '@/config/diagrams/sequence.json';
import { cn } from '@/lib/cn';

type Kind = 'self' | 'call' | 'return' | 'hold' | 'check' | 'end' | 'lost' | 'fail';

const lifelineColor = (id: string) => actorColor(id as ActorId);

/** A sequence diagram of one unit: the runner, the coordinator and the specialists it calls. */
export const CoordinatorSequence = () => {
  const t = useTranslations('diagrams');
  const [scenarioId, setScenarioId] = useState(sequenceData.scenarios[0].id);
  const scenario = sequenceData.scenarios.find((item) => item.id === scenarioId) ?? sequenceData.scenarios[0];
  const stepper = useStepper(scenario.steps.length);
  const lanes = scenario.lifelines;
  const x = (id: string) => ((lanes.indexOf(id) + 0.5) / lanes.length) * 100;
  const endIndex = scenario.steps.findIndex((step) => step.kind === 'end');
  const current = scenario.steps[stepper.step];

  const laneLabel = (id: string) => (isRole(id) ? id : t(`sequence.lifelines.${id}`));

  const handleScenario = (id: string) => {
    setScenarioId(id);
    stepper.reset();
  };

  return (
    <DiagramFrame
      label={t('sequence.label')}
      scenarios={sequenceData.scenarios.map((item) => ({ id: item.id, label: t(`sequence.scenarios.${item.id}`) }))}
      scenario={scenario.id}
      onScenario={handleScenario}
      stepper={stepper}
      length={scenario.steps.length}
      caption={
        <>
          <span className="mb-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            <Actor actor={current.from as ActorId} label={laneLabel(current.from)} />
            <code className="font-mono text-sm text-ink-soft">{t(`sequence.labels.${scenario.id}.${current.id}`)}</code>
          </span>
          <span className="block">{t(`sequence.steps.${scenario.id}.${current.id}`)}</span>
        </>
      }
    >
      <div className="px-0.5 pb-1">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${lanes.length}, minmax(0, 1fr))` }}>
          {lanes.map((id) => (
            <div key={id} className="flex flex-col items-center gap-1 px-0.5 text-center">
              <Avatar actor={(id === 'runner' ? 'runner' : id) as ActorId} />
              <span className="max-w-full truncate text-[11.5px] text-ink-mute sm:text-[12px]">{laneLabel(id)}</span>
            </div>
          ))}
        </div>
        <ol className="mt-2">
          {scenario.steps.map((step, index) => {
            const kind = step.kind as Kind;
            const state = index < stepper.step ? 'past' : index === stepper.step ? 'current' : 'future';
            const danger = kind === 'fail' || kind === 'lost' || kind === 'end';
            const color = danger ? 'var(--color-danger)' : lifelineColor(step.from);
            const x1 = x(step.from);
            const x2 = x(step.to);
            const self = step.from === step.to;
            return (
              <li
                key={step.id}
                className={cn(
                  'relative h-12 rounded-btn transition-[opacity,background-color] duration-300',
                  state === 'current' && 'bg-surface-2',
                  state === 'future' && 'opacity-20',
                )}
              >
                {/* Lifelines; the coordinator's ends at the step where its process exits. */}
                {lanes.map((id) => {
                  const dead = id === 'coordinator' && endIndex >= 0 && index > endIndex;
                  return dead ? null : (
                    <span key={id} aria-hidden className="absolute inset-y-0 w-px bg-line" style={{ left: `${x(id)}%` }} />
                  );
                })}
                {kind === 'end' && (
                  <span
                    aria-hidden
                    className="absolute bottom-0 -translate-x-1/2 text-base leading-none font-bold"
                    style={{ left: `${x('coordinator')}%`, color: 'var(--color-danger)' }}
                  >
                    ×
                  </span>
                )}
                {self ? (
                  <SelfMessage
                    x={x1}
                    color={color}
                    label={t(`sequence.labels.${scenario.id}.${step.id}`)}
                    kind={kind}
                    active={state === 'current'}
                  />
                ) : (
                  <Arrow
                    x1={x1}
                    x2={x2}
                    color={color}
                    kind={kind}
                    label={t(`sequence.labels.${scenario.id}.${step.id}`)}
                    active={state === 'current'}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </DiagramFrame>
  );
};

interface ArrowProps {
  x1: number;
  x2: number;
  color: string;
  kind: Kind;
  label: string;
  active: boolean;
}

const Arrow = ({ x1, x2, color, kind, label, active }: ArrowProps) => {
  const left = Math.min(x1, x2);
  const width = Math.abs(x2 - x1);
  const toRight = x2 > x1;
  const dashed = kind === 'return' || kind === 'lost' || kind === 'end';
  // A lost answer stops short of the dead lifeline.
  const reach = kind === 'lost' ? 0.7 : 1;
  const lineLeft = toRight ? left : left + width * (1 - reach);
  const lineWidth = width * reach;

  return (
    <>
      <span
        className="absolute top-1.5 -translate-x-1/2 text-[11.5px] leading-tight whitespace-nowrap sm:text-[13px]"
        style={{ left: `${left + width / 2}%`, color: active ? 'var(--color-ink)' : 'var(--color-ink-soft)' }}
      >
        {label}
      </span>
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleX: 1 }}
        className="absolute top-[30px] h-0"
        style={{
          left: `${lineLeft}%`,
          width: `${lineWidth}%`,
          borderTop: `2px ${dashed ? 'dashed' : 'solid'} ${color}`,
          transformOrigin: toRight ? 'left' : 'right',
        }}
      />
      {kind === 'lost' ? (
        <span
          aria-hidden
          className="absolute top-[21px] -translate-x-1/2 text-base leading-none font-bold"
          style={{ left: `${lineLeft}%`, color }}
        >
          ×
        </span>
      ) : (
        <svg
          aria-hidden
          viewBox="0 0 10 10"
          className="absolute top-[26px] size-2.5"
          style={{
            left: `calc(${toRight ? left + width : left}% - ${toRight ? 9 : 1}px)`,
            color,
            transform: toRight ? undefined : 'scaleX(-1)',
          }}
        >
          <path d="M0 0l10 5-10 5z" fill="currentColor" />
        </svg>
      )}
    </>
  );
};

interface SelfProps {
  x: number;
  color: string;
  kind: Kind;
  label: string;
  active: boolean;
}

const SelfMessage = ({ x, color, kind, label, active }: SelfProps) => (
  <>
    <span
      aria-hidden
      className={cn('absolute top-2 h-8 w-3.5 rounded-r-md', kind === 'hold' && 'w-2.5 rounded-sm')}
      style={
        kind === 'hold'
          ? { left: `calc(${x}% - 5px)`, background: color }
          : { left: `${x}%`, border: `2px solid ${color}`, borderLeft: 'none' }
      }
    />
    <span
      className="absolute top-1/2 -translate-y-1/2 pl-5 text-[11.5px] leading-tight whitespace-nowrap sm:text-[13px]"
      style={{ left: `${x}%`, color: kind === 'fail' ? 'var(--color-danger)' : active ? 'var(--color-ink)' : 'var(--color-ink-soft)' }}
    >
      {label}
    </span>
  </>
);
