'use client';

import { type DocSlug, docSlugs } from '@/config/navigation';
import { usePathname } from '@/i18n/navigation';

/** Where the reader is in the guide, from the current path. */
export const useChapter = () => {
  const pathname = usePathname();
  const slug = pathname.replace(/^\//, '') as DocSlug;
  const index = docSlugs.indexOf(slug);
  const isHome = pathname === '/';
  // Neither the home page nor a chapter: the 404. Nothing is current there, and there is no next step.
  const isLost = !isHome && index < 0;
  return {
    slug: index < 0 ? null : slug,
    index,
    isHome,
    isLost,
    total: docSlugs.length,
    prev: index <= 0 ? null : docSlugs[index - 1],
    next: isHome ? docSlugs[0] : index < 0 ? null : (docSlugs[index + 1] ?? null),
  };
};
