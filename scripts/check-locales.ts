// Fails when a content page or a message key exists in one locale but not the other.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..', 'src');
const locales = ['uk', 'en'];
const slugs = ['concepts', 'roles', 'coordination', 'lifecycle', 'loop', 'contracts', 'dashboard', 'lessons'];
const problems: string[] = [];

const files = Object.fromEntries(locales.map((locale) => [locale, new Set(readdirSync(path.join(root, 'content', locale)))]));
const all = new Set(locales.flatMap((locale) => [...files[locale]]));
for (const file of all) {
  for (const locale of locales) if (!files[locale].has(file)) problems.push(`content/${locale}/${file} is missing`);
}
for (const slug of slugs) {
  if (!all.has(`${slug}.mdx`)) problems.push(`content/*/${slug}.mdx is missing for a navigation slug`);
}

const keys = (value: unknown, prefix = ''): string[] =>
  value && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) => keys(child, prefix ? `${prefix}.${key}` : key))
    : [prefix];
const messages = Object.fromEntries(
  locales.map((locale) => [locale, new Set(keys(JSON.parse(readFileSync(path.join(root, 'messages', `${locale}.json`), 'utf8'))))]),
);
for (const locale of locales) {
  for (const other of locales) {
    for (const key of messages[other]) if (!messages[locale].has(key)) problems.push(`messages/${locale}.json lacks ${key}`);
  }
}

// Scripted diagrams: every scenario and every step id in the JSON needs a caption in each locale.
const diagramDir = path.join(root, 'config', 'diagrams');
const parsedMessages = Object.fromEntries(
  locales.map((locale) => [locale, JSON.parse(readFileSync(path.join(root, 'messages', `${locale}.json`), 'utf8'))]),
);
for (const file of readdirSync(diagramDir).filter((name) => name.endsWith('.json'))) {
  const name = file.replace(/\.json$/, '');
  const data = JSON.parse(readFileSync(path.join(diagramDir, file), 'utf8'));
  if (!Array.isArray(data.scenarios)) continue;
  for (const scenario of data.scenarios) {
    for (const locale of locales) {
      const block = parsedMessages[locale].diagrams?.[name];
      if (!block?.scenarios?.[scenario.id]) problems.push(`messages/${locale}.json lacks diagrams.${name}.scenarios.${scenario.id}`);
      for (const step of scenario.steps) {
        if (!block?.steps?.[scenario.id]?.[step.id])
          problems.push(`messages/${locale}.json lacks diagrams.${name}.steps.${scenario.id}.${step.id}`);
      }
    }
  }
}

// Screenshots: every shot needs an alt and a caption, and every marker a legend line, in each locale.
const shots = JSON.parse(readFileSync(path.join(root, 'config', 'shots.json'), 'utf8'));
for (const [name, shot] of Object.entries<{ markers: { id: string }[] }>(shots)) {
  for (const locale of locales) {
    const block = parsedMessages[locale].shots?.[name];
    for (const key of ['alt', 'caption']) if (!block?.[key]) problems.push(`messages/${locale}.json lacks shots.${name}.${key}`);
    for (const marker of shot.markers) {
      if (!block?.markers?.[marker.id]) problems.push(`messages/${locale}.json lacks shots.${name}.markers.${marker.id}`);
    }
  }
}

if (problems.length) {
  console.error(`Locale check failed:\n- ${[...new Set(problems)].join('\n- ')}`);
  process.exit(1);
}
console.log(`Locale check passed: ${all.size} content files and ${messages.en.size} message keys in ${locales.join(' + ')}.`);
