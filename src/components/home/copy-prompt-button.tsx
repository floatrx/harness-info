'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/cn';

interface Props {
  prompt: string;
  className?: string;
}

/** The home page's main action: copies the whole starter prompt and says where to paste it. */
export const CopyPromptButton = ({ prompt, className }: Props) => {
  const t = useTranslations('home');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <span className={cn('inline-grid gap-1.5', className)}>
      <button
        type="button"
        onClick={handleCopy}
        data-testid="copy-starter-prompt"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-btn bg-accent px-[18px] text-[14.5px] font-semibold text-accent-ink transition-[background-color,transform] hover:bg-accent-hover active:scale-[0.97]"
      >
        {copied ? `✓ ${t('starterCopied')}` : t('starterCopy')}
      </button>
      <span aria-live="polite" className="text-[12.5px] text-ink-mute">
        {copied ? t('starterPaste') : ''}
      </span>
    </span>
  );
};
