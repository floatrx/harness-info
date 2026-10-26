import type { ReactNode } from 'react';

import { getTranslations } from 'next-intl/server';

import { ShotFigure } from '@/components/mdx/shot-figure';
import shots from '@/config/shots.json';

type ShotName = keyof typeof shots;

interface Props {
  /** A file in `public/screenshots/`, copied from harness-demo by `pnpm sync:shots`. */
  name: ShotName;
  /** No markers and no legend: a caption and a link to the annotated shot on /dashboard. */
  plain?: boolean;
  /** The first shot of a page: load it at once. */
  eager?: boolean;
}

const code = (chunks: ReactNode) => <code>{chunks}</code>;

/** A real dashboard screenshot. Marker positions come from `config/shots.json`, their texts from `messages.shots`. */
export const Shot = async ({ name, plain, eager }: Props) => {
  const t = await getTranslations('shots');
  const markers = plain
    ? []
    : shots[name].markers.map((marker, index) => ({
        ...marker,
        n: index + 1,
        label: t.rich(`${name}.markers.${marker.id}`, { code }),
      }));

  return (
    <ShotFigure
      id={`shot-${name}`}
      src={`/screenshots/${name}.png`}
      alt={t(`${name}.alt`)}
      caption={t.rich(`${name}.caption`, { code })}
      markers={markers}
      labels={{ open: t('open'), close: t('close'), legend: t('legend') }}
      more={plain ? { href: `/dashboard#shot-${name}`, label: t('more') } : undefined}
      eager={eager}
    />
  );
};
