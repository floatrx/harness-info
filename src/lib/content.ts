import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import GithubSlugger from 'github-slugger';

export interface Heading {
  id: string;
  text: string;
}

const contentDir = path.join(process.cwd(), 'src', 'content');

/** Strip inline markdown so the text matches what rehype-slug sees. */
const plain = (value: string) =>
  value
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_]/g, '')
    .trim();

/** The `##` headings of a content file, with the ids rehype-slug gives them. */
export const getHeadings = async (locale: string, slug: string): Promise<Heading[]> => {
  const source = await readFile(path.join(contentDir, locale, `${slug}.mdx`), 'utf8');
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of source.split('\n')) {
    if (line.startsWith('```')) inFence = !inFence;
    if (inFence) continue;
    const match = /^(#{2,6})\s+(.+)$/.exec(line);
    if (!match) continue;
    const text = plain(match[2]);
    // Every heading advances the slugger, so duplicate ids stay in step with rehype-slug.
    const id = slugger.slug(text);
    if (match[1].length === 2) headings.push({ id, text });
  }

  return headings;
};
