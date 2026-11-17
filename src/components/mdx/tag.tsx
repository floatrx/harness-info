import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/** A small inline label next to a table row name, e.g. a screen harness-demo does not have yet. */
export const Tag = ({ children }: Props) => (
  <span className="ml-1.5 inline-block rounded-md bg-accent-soft px-1.5 py-px align-[1px] text-[11.5px] font-semibold whitespace-nowrap text-accent-text">
    {children}
  </span>
);
