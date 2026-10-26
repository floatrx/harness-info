'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/cn';

const labels: Record<string, string> = { uk: 'UA', en: 'EN' };

export const LocaleSwitch = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <div role="group" aria-label={t('language')} className="flex gap-0.5 rounded-lg bg-surface p-0.5 max-[899px]:p-0">
      {routing.locales.map((item) => (
        <Link
          key={item}
          href={pathname}
          locale={item}
          hrefLang={item}
          aria-current={item === locale ? 'true' : undefined}
          className={cn(
            'grid h-7 min-w-[34px] place-items-center rounded-md px-2 text-[12.5px] font-semibold transition-colors max-[899px]:h-11 max-[899px]:min-w-11',
            item === locale ? 'bg-surface-2 text-ink' : 'text-ink-mute hover:text-ink',
          )}
        >
          {labels[item]}
        </Link>
      ))}
    </div>
  );
};
