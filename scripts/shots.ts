// Screenshots every page in both locales at desktop and phone width, and checks the 390 px rules.
// Usage: node scripts/shots.ts [baseUrl] [outDir]
import { mkdirSync } from 'node:fs';
import path from 'node:path';

import { chromium } from 'playwright-core';

const base = process.argv[2] ?? 'http://localhost:3012';
const out = process.argv[3] ?? '.shots';
const locales = ['uk', 'en'];
const pages = ['', 'concepts', 'roles', 'coordination', 'lifecycle', 'loop', 'contracts', 'dashboard', 'lessons'];
const widths = [1440, 390];

mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const problems: string[] = [];

for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const locale of locales) {
    for (const slug of pages) {
      const url = `${base}/${locale}${slug ? `/${slug}` : ''}`;
      await page.goto(url, { waitUntil: 'networkidle' });
      const report = await page.evaluate(() => {
        const doc = document.documentElement;
        const goal = document.querySelector('h1 + p');
        const next = [...document.querySelectorAll('[data-testid="dock-next"], [data-testid="bottom-next"]')].find(
          (element) => element.getBoundingClientRect().width > 0,
        );
        const box = next?.getBoundingClientRect();
        return {
          nextVisible: !!box && box.top >= 0 && box.bottom <= window.innerHeight,
          overflow: doc.scrollWidth - doc.clientWidth,
          goalBottom: goal ? goal.getBoundingClientRect().bottom : null,
          viewport: window.innerHeight,
        };
      });
      const name = `${locale}-${slug || 'home'}-${width}`;
      if (!report.nextVisible && !slug.endsWith('lessons')) problems.push(`${name}: the next step is not on the first screen`);
      if (report.overflow > 0) problems.push(`${name}: horizontal overflow ${report.overflow}px`);
      if (report.goalBottom === null) problems.push(`${name}: no goal line after h1`);
      else if (report.goalBottom > report.viewport)
        problems.push(`${name}: goal line ends at ${Math.round(report.goalBottom)}px, below the first screen`);
      await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true });
    }
  }
  await context.close();
}

await browser.close();
console.log(
  problems.length ? `Problems:\n- ${problems.join('\n- ')}` : `All ${locales.length * pages.length * widths.length} shots clean.`,
);
process.exit(problems.length ? 1 : 0);
