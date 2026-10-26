/** Content pages in reading order. Titles and goals live in `messages/<locale>.json` under `pages.<slug>`. */
export const docSlugs = ['concepts', 'roles', 'coordination', 'lifecycle', 'loop', 'contracts', 'dashboard', 'quickstart', 'adapt', 'lessons'] as const;

export type DocSlug = (typeof docSlugs)[number];

export const isDocSlug = (value: string): value is DocSlug => (docSlugs as readonly string[]).includes(value);

export const getNeighbours = (slug: DocSlug) => {
  const index = docSlugs.indexOf(slug);
  return {
    prev: index > 0 ? docSlugs[index - 1] : null,
    next: index < docSlugs.length - 1 ? docSlugs[index + 1] : null,
  };
};
