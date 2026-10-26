import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

import { type DocSlug, docSlugs } from '@/config/navigation';
import en from '@/messages/en.json';
import uk from '@/messages/uk.json';

const messages = { en, uk };

// Colours from src/styles/theme.css; next/og cannot read CSS variables.
const color = {
  ground: '#0d0d0d',
  surface2: '#1b1b1b',
  line: '#2e2e2e',
  ink: '#efefef',
  inkSoft: '#c4c4c4',
  inkMute: '#9e9e9e',
  faint: '#616161',
  accent: '#d97757',
  track: '#262626',
  trackPast: '#666666',
};

const fill = (text: string, values: Record<string, number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

// next/og reads woff but not woff2, so the fonts come from @fontsource rather than next/font.
// Each subset gets its own family name: with one name, next/og takes the first file per weight and
// falls back to the regular cyrillic face for bold Cyrillic text.
const fontDir = path.join(process.cwd(), 'node_modules', '@fontsource', 'onest', 'files');
const subsets = { latin: 'Onest', cyrillic: 'OnestCyrillic' } as const;
const loadFonts = () =>
  Promise.all(
    (Object.keys(subsets) as (keyof typeof subsets)[]).flatMap((subset) =>
      ([400, 600] as const).map(async (weight) => ({
        name: subsets[subset],
        data: await readFile(path.join(fontDir, `onest-${subset}-${weight}-normal.woff`)),
        weight,
        style: 'normal' as const,
      })),
    ),
  );

/** The 1200×630 share card of a page: where it sits in the guide, its title and its goal, in the dashboard's colours. */
export const renderCard = async (locale: string, slug: DocSlug | null) => {
  const m = locale === 'en' ? messages.en : messages.uk;
  const total = docSlugs.length;
  const index = slug ? docSlugs.indexOf(slug) : -1;
  const where = slug ? fill(m.doc.chapterOf, { n: index + 1, total }) : `${m.nav.overview} · ${fill(m.doc.beforeFirst, { total })}`;
  const title = slug ? m.pages[slug].title : m.home.title;
  const goal = slug ? m.pages[slug].goal : m.home.goal;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '64px 72px',
        background: color.ground,
        color: color.ink,
        fontFamily: `${subsets.latin}, ${subsets.cyrillic}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, fontWeight: 600 }}>
          <svg width="44" height="44" viewBox="0 0 22 22">
            <path d="M5 11a6 6 0 1 1 6 6" fill="none" stroke={color.accent} strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="11" cy="11" r="2.4" fill={color.accent} />
            <circle cx="5" cy="17" r="1.6" fill={color.accent} />
          </svg>
          <span>{m.site.name}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
          <span style={{ fontSize: 26, color: color.inkMute }}>{where}</span>
          <div style={{ display: 'flex', gap: 6, width: 380 }}>
            {docSlugs.map((item, position) => (
              <div
                key={item}
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  background: position === index ? color.accent : position < index ? color.trackPast : color.track,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
        <div style={{ fontSize: title.length > 30 ? 64 : 80, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.02em', maxWidth: 1040 }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginTop: 26 }}>
          <span
            style={{
              marginTop: 6,
              padding: '4px 14px',
              borderRadius: 9,
              border: `1px solid ${color.line}`,
              background: color.surface2,
              fontSize: 22,
              color: color.inkSoft,
            }}
          >
            {m.doc.goalShort}
          </span>
          <span style={{ maxWidth: 920, fontSize: 34, lineHeight: 1.35, color: color.inkSoft }}>{goal}</span>
        </div>
        <div style={{ marginTop: 44, fontSize: 22, color: color.faint }}>{m.og.footer}</div>
      </div>
    </div>,
    { width: 1200, height: 630, fonts: await loadFonts() },
  );
};
