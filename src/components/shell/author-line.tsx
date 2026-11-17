import { getTranslations } from 'next-intl/server';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';

interface Props {
  className?: string;
}

/** "Idea and author" with a link to the author's site, on the home banner and under the chapter list. */
export const AuthorLine = async ({ className }: Props) => {
  const t = await getTranslations('site');
  return (
    <p className={cn('text-[12.5px] leading-snug text-ink-mute', className)}>
      {t.rich('author', {
        link: (chunks) => (
          <a
            href={siteConfig.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink-soft underline decoration-line underline-offset-[3px] hover:text-ink hover:decoration-ink-mute"
          >
            {chunks}
          </a>
        ),
      })}
    </p>
  );
};
