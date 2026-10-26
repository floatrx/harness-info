import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';

import { Children, cloneElement, isValidElement } from 'react';

import { CoordinatorSequence } from '@/components/diagrams/coordinator-sequence';
import { LoopAnatomy } from '@/components/diagrams/loop-anatomy';
import { StateMachine } from '@/components/diagrams/state-machine';
import { withActors } from '@/components/mdx/actor-cell';
import { CodeBlock } from '@/components/mdx/code-block';
import { Note } from '@/components/mdx/note';
import { Role } from '@/components/mdx/role';
import { Shot } from '@/components/mdx/shot';
import { Table } from '@/components/mdx/table';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

interface CellProps extends ComponentProps<'td'> {
  /** The first cell names the row (a stage, a status, a layer), so it never gets actor monograms. */
  rowHead?: boolean;
}

const Cell = ({ className, children, rowHead, ...props }: CellProps) => (
  <td className={cn('border-b border-line-soft py-[9px] pr-3 align-top text-ink first:font-semibold', className)} {...props}>
    {rowHead ? children : withActors(children)}
  </td>
);

const Row = ({ children, ...props }: ComponentProps<'tr'>) => {
  const cells = Children.toArray(children);
  const head = cells.findIndex((child) => isValidElement(child));
  return (
    <tr {...props}>
      {cells.map((child, index) =>
        index === head && isValidElement<CellProps>(child) && child.type === Cell ? cloneElement(child, { rowHead: true }) : child,
      )}
    </tr>
  );
};

const Anchor = ({ href = '', className, ...props }: ComponentProps<'a'>) => {
  // Underlined at rest: a link in running text must not differ by colour alone.
  const style = cn('text-accent underline decoration-accent-line underline-offset-[3px] hover:decoration-accent', className);
  // Internal links go through the locale-aware Link, so they keep the reader's language.
  if (href.startsWith('/')) return <Link href={href} className={style} {...props} />;
  if (href.startsWith('#')) return <a href={href} className={style} {...props} />;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={style} {...props} />;
};

const components: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        'mt-[52px] mb-3 scroll-mt-5 text-[20px] leading-tight font-semibold tracking-[-0.015em] text-balance text-ink first:mt-0 min-[900px]:text-[22px]',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => <h3 className={cn('mt-8 mb-2 scroll-mt-5 text-[17px] font-semibold text-ink', className)} {...props} />,
  p: ({ className, ...props }) => <p className={cn('mb-3.5 text-[16px] leading-[1.65] text-pretty text-ink', className)} {...props} />,
  ul: ({ className, ...props }) => (
    <ul className={cn('mb-4 list-disc pl-[22px] text-[16px] leading-[1.65] text-ink marker:text-faint', className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn('mb-4 list-decimal pl-[22px] text-[16px] leading-[1.65] text-ink marker:text-faint', className)} {...props} />
  ),
  li: ({ className, ...props }) => <li className={cn('my-1', className)} {...props} />,
  strong: ({ className, ...props }) => <strong className={cn('font-semibold text-ink', className)} {...props} />,
  a: Anchor,
  blockquote: ({ className, ...props }) => (
    <blockquote className={cn('my-5 rounded-panel border border-line bg-surface px-4 py-3.5 text-ink [&_p]:mb-0', className)} {...props} />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        'rounded-[5px] bg-surface-2 px-[5px] py-px font-mono text-[0.86em] break-words text-ink [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-[13px]',
        className,
      )}
      {...props}
    />
  ),
  pre: CodeBlock,
  table: Table,
  th: ({ className, ...props }) => (
    <th
      className={cn('border-b border-line py-2 pr-3 text-left align-bottom text-[12px] font-semibold text-ink-mute', className)}
      {...props}
    />
  ),
  tr: Row,
  td: Cell,
  hr: () => <div aria-hidden className="h-12" />,
  CoordinatorSequence,
  LoopAnatomy,
  Note,
  Role,
  Shot,
  StateMachine,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
