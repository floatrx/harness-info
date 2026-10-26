'use client';

import { type DocSlug, docSlugs } from '@/config/navigation';
import { usePathname } from '@/i18n/navigation';

/** Where the reader is in the guide, from the current path. */
export const useChapter = () => {
  const pathname = usePathname();
  const slug = pathname.replace(/^\//, '') as DocSlug;
  const index = docSlugs.indexOf(slug);
  const isHome = index < 0;
  return {
    slug: isHome ? null : slug,
    index,
    isHome,
    total: docSlugs.length,
    prev: isHome || index === 0 ? null : docSlugs[index - 1],
    next: isHome ? docSlugs[0] : (docSlugs[index + 1] ?? null),
  };
};
