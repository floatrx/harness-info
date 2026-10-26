'use client';

import type { Heading } from '@/lib/content';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';

interface Props {
  headings: Heading[];
}

/** The dock's table of contents; marks the section in view. */
export const Toc = ({ headings }: Props) => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -70% 0px' },
    );
    for (const heading of headings) {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [headings]);

  return (
    <ol className="grid">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            className={cn(
              'block border-l-2 py-[5px] pl-3 text-[13px] leading-snug transition-colors',
              active === heading.id ? 'border-accent font-medium text-ink' : 'border-line-soft text-ink-mute hover:text-ink',
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );
};
