'use client';

import type { ComponentProps } from 'react';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/cn';

/** `pre` for MDX code fences, with a copy button that is always visible (touch screens have no hover). */
export const CodeBlock = ({ className, children, ...props }: ComponentProps<'pre'>) => {
  const t = useTranslations('doc');
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ref.current?.innerText ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="relative mb-4">
      <pre
        ref={ref}
        className={cn(
          // Lines wrap inside the right padding, so no line ever runs under the copy button; copying keeps the real newlines.
          'rounded-panel border border-line-soft bg-surface py-3.5 pr-24 pl-4 font-mono text-[13px] leading-[1.6] whitespace-pre-wrap text-ink [overflow-wrap:anywhere]',
          className,
        )}
        {...props}
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 min-h-9 rounded-md bg-surface-3 px-3 text-xs font-medium text-ink-soft transition-colors hover:text-ink active:scale-95"
      >
        {copied ? t('copied') : t('copy')}
      </button>
    </div>
  );
};
