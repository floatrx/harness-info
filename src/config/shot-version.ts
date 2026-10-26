import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import shots from './shots.json';

/**
 * A short content hash per dashboard screenshot. The image URL carries it (`?v=…`), so a re-synced shot gets a new URL
 * and no image cache (next/image, a CDN, the browser) can serve the old picture under the same address.
 */
export const shotVersions = (root: string = process.cwd()): Record<string, string> =>
  Object.fromEntries(
    Object.keys(shots).map((name) => [
      name,
      createHash('sha256')
        .update(readFileSync(path.join(root, 'public', 'screenshots', `${name}.png`)))
        .digest('hex')
        .slice(0, 10),
    ]),
  );
