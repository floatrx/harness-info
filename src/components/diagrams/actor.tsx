import type { ComponentProps } from 'react';

import { roleColor, roleHue, type RoleId, roleIds, roleMonogram } from '@/config/roles';
import { cn } from '@/lib/cn';

export type ActorId = RoleId | 'human' | 'harness' | 'runner' | 'coordinator' | 'none';

export const isRole = (value: string): value is RoleId => (roleIds as readonly string[]).includes(value);

export const actorColor = (actor: ActorId) =>
  actor === 'human'
    ? 'var(--color-human)'
    : actor === 'harness' || actor === 'runner'
      ? 'var(--color-ink-mute)'
      : actor === 'coordinator'
        ? 'var(--color-ink)'
        : actor === 'none'
          ? 'var(--color-faint)'
          : roleColor[actor];

interface AvatarProps extends ComponentProps<'span'> {
  actor: ActorId;
  /** Text for "you", which the caller localizes. */
  you?: string;
  size?: 'sm' | 'md';
}

/** The dashboard's identity mark: a hue-tinted monogram for a role, a square for code, a pill for you. */
export const Avatar = ({ actor, you = 'Ти', size = 'md', className, style, ...props }: AvatarProps) => {
  const dim = size === 'sm' ? 'size-[18px] text-[8.5px]' : 'size-[22px] text-[10px]';
  if (actor === 'human')
    return (
      <span
        aria-hidden
        className={cn(
          'inline-grid h-[22px] place-items-center rounded-full bg-accent-soft px-[7px] text-[11px] font-bold text-accent',
          className,
        )}
        {...props}
      >
        {you}
      </span>
    );
  if (actor === 'none')
    return (
      <span
        aria-hidden
        className={cn(
          'inline-grid shrink-0 place-items-center rounded-full border border-dashed border-line font-bold text-faint',
          dim,
          className,
        )}
        {...props}
      >
        —
      </span>
    );
  if (actor === 'harness' || actor === 'runner' || actor === 'coordinator')
    return (
      <span
        aria-hidden
        className={cn(
          'inline-grid shrink-0 place-items-center font-bold',
          dim,
          actor === 'coordinator'
            ? 'rounded-full bg-[#232323] text-[#e2e2e2] shadow-[inset_0_0_0_1px_#3d3d3d]'
            : 'rounded-md bg-surface-3 text-[#cfcfcf]',
          className,
        )}
        {...props}
      >
        {actor === 'coordinator' ? 'Co' : actor === 'runner' ? 'Rn' : 'H'}
      </span>
    );
  const hue = roleHue[actor];
  return (
    <span
      aria-hidden
      className={cn('inline-grid shrink-0 place-items-center rounded-full font-bold tracking-[-0.02em]', dim, className)}
      style={{ background: `hsl(${hue} 38% 21%)`, color: `hsl(${hue} 75% 76%)`, ...style }}
      {...props}
    >
      {roleMonogram[actor]}
    </span>
  );
};

interface Props extends ComponentProps<'span'> {
  actor: ActorId;
  label: string;
  you?: string;
}

/** A role or a person: the monogram and the name, as the dashboard shows them. */
export const Actor = ({ actor, label, you, className, ...props }: Props) => (
  <span className={cn('inline-flex items-center gap-2 text-sm font-medium text-ink', className)} {...props}>
    <Avatar actor={actor} you={you ?? label} />
    {actor !== 'human' && label}
  </span>
);
