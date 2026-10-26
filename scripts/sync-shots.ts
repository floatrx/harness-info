// Copies the dashboard screenshots from harness-demo into public/screenshots/, or checks the copies.
// Usage: node scripts/sync-shots.ts [--check]   (HARNESS_DEMO_DIR overrides ../harness-demo)
// The shots are generated in harness-demo (`pnpm -C dashboard build && pnpm dashboard:e2e --docs`); never edit them here.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const demoDir = process.env.HARNESS_DEMO_DIR ?? path.join(root, '..', 'harness-demo');
const sourceDir = path.join(demoDir, 'docs', 'screenshots');
const targetDir = path.join(root, 'public', 'screenshots');
const names = Object.keys(JSON.parse(readFileSync(path.join(root, 'src', 'config', 'shots.json'), 'utf8')));
const expected = { width: 2880, height: 1800 };
const check = process.argv.includes('--check');
const hasSource = existsSync(sourceDir);
const problems: string[] = [];

// A PNG keeps its width and height as big-endian integers at bytes 16 and 20 of the IHDR chunk.
const sizeOf = (file: string) => {
  const head = readFileSync(file).subarray(0, 24);
  return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
};

if (!check) {
  if (!hasSource) {
    console.error(`Shot sync failed: ${sourceDir} not found.`);
    process.exit(1);
  }
  mkdirSync(targetDir, { recursive: true });
}

for (const name of names) {
  const source = path.join(sourceDir, `${name}.png`);
  const target = path.join(targetDir, `${name}.png`);
  if (!check) {
    if (existsSync(source)) copyFileSync(source, target);
    else problems.push(`${source} is missing in harness-demo`);
  }
  if (!existsSync(target)) {
    problems.push(`public/screenshots/${name}.png is missing — run pnpm sync:shots`);
    continue;
  }
  const { width, height } = sizeOf(target);
  if (width !== expected.width || height !== expected.height)
    problems.push(`public/screenshots/${name}.png is ${width}×${height}, expected ${expected.width}×${expected.height}`);
  if (check && hasSource && existsSync(source) && !readFileSync(source).equals(readFileSync(target)))
    problems.push(`public/screenshots/${name}.png is stale — run pnpm sync:shots`);
}

if (problems.length) {
  console.error(`Shot ${check ? 'check' : 'sync'} failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
const note = check && !hasSource ? ' (harness-demo not found: freshness not compared)' : '';
console.log(`Shot ${check ? 'check passed' : 'sync done'}: ${names.length} screenshots in public/screenshots/${note}.`);
