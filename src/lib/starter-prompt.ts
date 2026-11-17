import { readFile } from 'node:fs/promises';
import path from 'node:path';

/** The starter prompt has one source, `public/starter-prompt.md`: the page copies it and `/starter-prompt.md` serves it raw. */
export const readStarterPrompt = async () => (await readFile(path.join(process.cwd(), 'public', 'starter-prompt.md'), 'utf8')).trim();
