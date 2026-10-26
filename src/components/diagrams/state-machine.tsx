'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Actor, actorColor, type ActorId } from '@/components/diagrams/actor';
import statesData from '@/config/diagrams/states.json';
import { flow } from '@/config/flow';
import { cn } from '@/lib/cn';

type Layout = 'd' | 'm';
type Rect = [number, number, number, number];
type Edge = (typeof statesData.edges)[number] & { fromPort?: string; toPort?: string; guard?: string; bend?: { d: number; m: number } };
interface Point {
  x: number;
  y: number;
}

const nodes = statesData.nodes as unknown as Record<string, { d: Rect; m: Rect }>;
const statuses = flow.map((item) => item.status);
const ownerOf = (status: string) => flow.find((item) => item.status === status)?.owner ?? 'none';

/** A prototype node is split in two halves: drafting (left) and review (right). */
const rectOf = (status: string, layout: Layout, port?: string): Rect => {
  const [x, y, w, h] = nodes[status][layout];
  if (status !== 'prototype' || !port) return [x, y, w, h];
  return port === 'drafting' ? [x, y, w / 2, h] : [x + w / 2, y, w / 2, h];
};

const center = ([x, y, w, h]: Rect): Point => ({ x: x + w / 2, y: y + h / 2 });

// Server and browser can disagree on the last digits of trigonometry; round so hydration matches.
const r = (value: number) => Math.round(value * 100) / 100;

/** Where the ray from the rect's centre towards `target` leaves the rect. */
const exitPoint = (rect: Rect, target: Point): Point => {
  const c = center(rect);
  const dx = target.x - c.x;
  const dy = target.y - c.y;
  if (dx === 0 && dy === 0) return c;
  const scale = Math.min(Math.abs(rect[2] / 2 / (dx || 1e-9)), Math.abs(rect[3] / 2 / (dy || 1e-9)));
  return { x: c.x + dx * scale, y: c.y + dy * scale };
};

const geometry = (edge: Edge, layout: Layout) => {
  const a = rectOf(edge.from, layout, edge.fromPort);
  const b = rectOf(edge.to, layout, edge.toPort);
  const ca = center(a);
  const cb = center(b);
  const bend = edge.bend?.[layout] ?? 0;
  const mid = { x: (ca.x + cb.x) / 2, y: (ca.y + cb.y) / 2 };
  const len = Math.hypot(cb.x - ca.x, cb.y - ca.y) || 1;
  // Perpendicular offset: positive bends to the left of the direction of travel.
  const control = { x: mid.x + (-(cb.y - ca.y) / len) * bend, y: mid.y + ((cb.x - ca.x) / len) * bend };
  const start = exitPoint(a, control);
  const end = exitPoint(b, control);
  const label = { x: 0.25 * start.x + 0.5 * control.x + 0.25 * end.x, y: 0.25 * start.y + 0.5 * control.y + 0.25 * end.y };
  const angle = Math.atan2(end.y - control.y, end.x - control.x);
  return {
    d: `M${r(start.x)},${r(start.y)} Q${r(control.x)},${r(control.y)} ${r(end.x)},${r(end.y)}`,
    end: { x: r(end.x), y: r(end.y) },
    angle: r((angle * 180) / Math.PI),
    label: { x: r(label.x), y: r(label.y) },
  };
};

const parkGeometry = (from: string, layout: Layout) =>
  geometry({ id: 'park', action: 'park', actor: 'agent', from, to: 'parked', bend: { d: -24, m: 24 } } as Edge, layout);

/** The task state machine from harness-demo: pick a status to see who owns it and every way out of it. */
export const StateMachine = () => {
  const t = useTranslations('diagrams.states');
  const tActors = useTranslations('diagrams.actors');
  const [selected, setSelected] = useState('qa');
  const [full, setFull] = useState(false);
  const [merge, setMerge] = useState(false);

  const visible = (edge: Edge) => {
    if (edge.guard === 'full') return full;
    if (edge.guard === 'merge') return merge;
    if (edge.guard === 'notMerge') return !merge;
    return true;
  };
  const edges = (statesData.edges as Edge[]).filter(visible);
  const outgoing = edges.filter((edge) => edge.from === selected);
  const canPark = !statesData.park.except.includes(selected);
  const owner = ownerOf(selected);
  const edgeColor = (edge: Edge) => (edge.actor === 'human' ? 'var(--color-human)' : actorColor(ownerOf(edge.from) as ActorId));

  const renderSvg = (layout: Layout) => {
    const [width, height] = statesData.box[layout];
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 size-full" aria-hidden>
        {edges.map((edge) => {
          const g = geometry(edge, layout);
          const active = edge.from === selected;
          const color = edgeColor(edge);
          return (
            <g key={edge.id} opacity={active ? 1 : 0.22} className="transition-opacity duration-300">
              <path
                d={g.d}
                fill="none"
                stroke={color}
                strokeWidth={active ? 2.2 : 1.4}
                strokeDasharray={edge.actor === 'human' ? undefined : '0'}
              />
              <path d="M0,-4.5 L9,0 L0,4.5 Z" fill={color} transform={`translate(${g.end.x},${g.end.y}) rotate(${g.angle})`} />
              {active && (
                <text
                  x={g.label.x}
                  y={g.label.y - 5}
                  textAnchor="middle"
                  className="fill-ink font-mono text-[11px]"
                  style={{ paintOrder: 'stroke', stroke: 'var(--color-surface-2)', strokeWidth: 4 }}
                >
                  {edge.action}
                </text>
              )}
            </g>
          );
        })}
        {canPark && selected !== 'parked' && (
          <g>
            <path d={parkGeometry(selected, layout).d} fill="none" stroke="var(--color-danger)" strokeWidth={1.8} strokeDasharray="5 4" />
            <path
              d="M0,-4.5 L9,0 L0,4.5 Z"
              fill="var(--color-danger)"
              transform={`translate(${parkGeometry(selected, layout).end.x},${parkGeometry(selected, layout).end.y}) rotate(${parkGeometry(selected, layout).angle})`}
            />
          </g>
        )}
      </svg>
    );
  };

  const renderNodes = (layout: Layout) => {
    const [width, height] = statesData.box[layout];
    return statuses.map((status) => {
      const [x, y, w, h] = nodes[status][layout];
      const isSelected = status === selected;
      const color = actorColor(ownerOf(status) as ActorId);
      const style = {
        left: `${(x / width) * 100}%`,
        top: `${(y / height) * 100}%`,
        width: `${(w / width) * 100}%`,
        height: `${(h / height) * 100}%`,
      };
      return (
        <button
          key={status}
          type="button"
          onClick={() => setSelected(status)}
          aria-pressed={isSelected}
          className={cn(
            'absolute flex items-center justify-center rounded-md font-mono text-[12px] font-medium transition-colors duration-200 sm:text-[12.5px]',
            isSelected ? 'bg-ink text-ground' : 'bg-surface-3 text-ink hover:bg-surface-3/70',
          )}
          style={{ ...style, boxShadow: `inset 0 -3px 0 ${color}` }}
        >
          {status === 'prototype' ? (
            <span className="grid size-full grid-cols-2">
              <span className="flex flex-col items-center justify-center leading-tight">
                prototype
                <span className="text-[10px] opacity-70">drafting</span>
              </span>
              <span
                className={cn('flex flex-col items-center justify-center leading-tight', isSelected ? 'bg-ground/10' : 'bg-surface-2/60')}
              >
                &nbsp;
                <span className="text-[10px] opacity-70">review</span>
              </span>
            </span>
          ) : (
            status
          )}
        </button>
      );
    });
  };

  const toggle = (label: string, value: boolean, onChange: (value: boolean) => void) => (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex min-h-11 items-center gap-2.5 rounded-md bg-surface-2 px-3 text-left font-mono text-[13px] text-ink transition-colors hover:bg-surface-3"
    >
      <span className={cn('relative h-5 w-9 shrink-0 rounded-full transition-colors', value ? 'bg-accent' : 'bg-surface-3')}>
        <span
          className={cn('absolute top-0.5 size-4 rounded-full bg-ink transition-transform', value ? 'translate-x-4.5' : 'translate-x-0.5')}
        />
      </span>
      {label}
    </button>
  );

  return (
    <figure
      data-ui
      aria-label={t('label')}
      className="not-prose my-4 mb-6 rounded-panel border border-line-soft bg-surface p-3 sm:px-3.5 sm:pt-3 sm:pb-3.5"
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {toggle('autonomy.mode: full', full, setFull)}
        {toggle('roles.mergeQaJudge', merge, setMerge)}
      </div>

      <div className="rounded-card bg-lane p-2">
        <div className="relative hidden md:block" style={{ aspectRatio: `${statesData.box.d[0]} / ${statesData.box.d[1]}` }}>
          {renderSvg('d')}
          {renderNodes('d')}
        </div>
        <div className="relative md:hidden" style={{ aspectRatio: `${statesData.box.m[0]} / ${statesData.box.m[1]}` }}>
          {renderSvg('m')}
          {renderNodes('m')}
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 px-1 text-[13px] text-ink-soft">
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-0.5 w-6 bg-human" />
            {t('legendHuman')}
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-0.5 w-6 bg-role-qa" />
            {t('legendAgent')}
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-0 w-6 border-t-2 border-dashed border-danger" />
            {t('legendPark')}
          </li>
        </ul>
      </div>

      <figcaption
        aria-live="polite"
        className="mt-3 rounded-card border border-[#232323] bg-card px-3.5 py-3 text-[15px] leading-[1.55] text-ink"
      >
        <span className="mb-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <code className="font-mono text-base font-semibold text-ink">{selected}</code>
          <Actor actor={owner as ActorId} label={owner === 'human' ? tActors('human') : owner === 'none' ? tActors('none') : owner} />
        </span>
        <span className="block">{t(`what.${selected}`)}</span>
        {(outgoing.length > 0 || canPark || selected === 'parked') && (
          <ul className="mt-3 flex flex-col gap-1.5">
            {outgoing.map((edge) => (
              <li key={edge.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px]">
                <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: edgeColor(edge) }} />
                <code className="font-mono text-sm text-ink">{edge.action}</code>
                <span className="text-ink-mute">→</span>
                <button
                  type="button"
                  onClick={() => setSelected(edge.to)}
                  className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-sm text-ink hover:bg-ink hover:text-ground"
                >
                  {edge.to}
                  {edge.toPort ? ` · ${edge.toPort}` : ''}
                </button>
                <span className="text-sm text-ink-soft">
                  {edge.actor === 'human' ? t('byHuman') : t('byAgent')}
                  {edge.guard ? ` · ${t(`guards.${edge.guard}`)}` : ''}
                </span>
              </li>
            ))}
            {selected === 'parked' && (
              <li className="flex flex-wrap items-center gap-x-2 text-[15px]">
                <span aria-hidden className="size-2 shrink-0 rounded-full bg-human" />
                <code className="font-mono text-sm text-ink">reopen</code>
                <span className="text-ink-mute">→</span>
                <span className="text-sm text-ink-soft">{t('reopen')}</span>
              </li>
            )}
            {canPark && selected !== 'parked' && (
              <li className="flex flex-wrap items-center gap-x-2 text-[15px]">
                <span aria-hidden className="size-2 shrink-0 rounded-full bg-danger" />
                <code className="font-mono text-sm text-ink">park</code>
                <span className="text-ink-mute">→</span>
                <span className="font-mono text-sm text-ink">parked</span>
                <span className="text-sm text-ink-soft">{t('park')}</span>
              </li>
            )}
          </ul>
        )}
      </figcaption>
    </figure>
  );
};
