'use client';

import type { ComponentProps } from 'react';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/cn';

/**
 * MDX table. On phones each row stacks into a card; the column names are copied into `data-label`
 * so every cell keeps its heading. Without JavaScript the cards simply have no labels.
 */
export const Table = ({ className, ...props }: ComponentProps<'table'>) => {
  const ref = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const table = ref.current;
    if (!table) return;
    const labels = [...table.querySelectorAll('thead th')].map((th) => th.textContent?.trim() ?? '');
    for (const row of table.querySelectorAll('tbody tr')) {
      row.querySelectorAll('td').forEach((td, index) => td.setAttribute('data-label', labels[index] ?? ''));
    }
  }, []);

  return (
    <div className="md-table mt-1.5 mb-5 sm:overflow-x-auto">
      <table ref={ref} className={cn('w-full border-collapse text-left text-[14.5px] leading-normal', className)} {...props} />
    </div>
  );
};
