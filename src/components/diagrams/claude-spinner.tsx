import type { ComponentProps } from 'react';

import { tv, type VariantProps } from '@/lib/tv';

const spinner = tv({
  base: 'inline-block w-[1.1em] flex-none text-center leading-none font-bold',
  variants: {
    state: {
      // An agent works right now.
      live: 'claude-spinner text-accent',
      // The task waits for an agent: the same glyph, still and faint.
      idle: 'claude-spinner-idle text-ink-mute',
    },
    size: {
      sm: 'text-[12px]',
      md: 'text-[14px]',
      lg: 'text-[18px]',
    },
  },
  defaultVariants: { state: 'live', size: 'md' },
});

interface Props extends ComponentProps<'span'>, VariantProps<typeof spinner> {}

/** The Claude Code thinking spinner (· ✢ ✳ ✶ ✻ ✽), the same one the harness-demo dashboard uses. */
export const ClaudeSpinner = ({ state, size, className, ...props }: Props) => (
  <span aria-hidden className={spinner({ state, size, className })} {...props} />
);
