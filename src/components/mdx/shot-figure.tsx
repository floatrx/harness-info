'use client';

import type { ReactNode } from 'react';

import { useRef, useState } from 'react';
import Image from 'next/image';

import { CloseIcon, ExpandIcon } from '@/components/shell/icons';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

export interface ShotMarker {
  id: string;
  n: number;
  x: number;
  y: number;
  label: ReactNode;
}

interface Labels {
  open: string;
  close: string;
  legend: string;
}

interface Props {
  id: string;
  src: string;
  alt: string;
  caption: ReactNode;
  markers: ShotMarker[];
  labels: Labels;
  /** The plain variant links to the annotated shot instead of carrying its own legend. */
  more?: { href: string; label: string };
  /** Load at once: set it on the first shot of a page, where the picture is above the fold. */
  eager?: boolean;
}

const pin = 'grid shrink-0 place-items-center rounded-full font-bold tabular-nums transition-[background-color,color,scale] duration-150';
const pinIdle = 'bg-ground/90 text-accent shadow-[inset_0_0_0_1.5px_var(--color-accent)]';
const pinActive = 'scale-125 bg-accent text-accent-ink';

/** A dashboard screenshot: numbered markers tied to a legend, and a full-size view in a dialog. */
export const ShotFigure = ({ id, src, alt, caption, markers, labels, more, eager }: Props) => {
  const [active, setActive] = useState<string | null>(null);
  // The full-size picture mounts only while the dialog is open, so a closed dialog never loads or shadows it.
  const [zoomed, setZoomed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const open = () => {
    setZoomed(true);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  const pins = (large: boolean) =>
    markers.map((marker) => (
      <span
        key={marker.id}
        aria-hidden
        onMouseEnter={() => setActive(marker.id)}
        onMouseLeave={() => setActive(null)}
        className={cn(
          pin,
          'absolute -translate-x-1/2 -translate-y-1/2',
          large ? 'size-7 text-[13px]' : 'size-[22px] text-[11.5px] max-[899px]:size-[18px] max-[899px]:text-[10px]',
          active === marker.id ? pinActive : pinIdle,
        )}
        style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
      >
        {marker.n}
      </span>
    ));

  return (
    <div id={id} className="not-prose my-6 scroll-mt-6">
      <figure>
        <div className="relative overflow-hidden rounded-panel border border-line-soft bg-surface">
          <button type="button" onClick={open} aria-label={labels.open} className="block w-full cursor-zoom-in">
            <Image
              src={src}
              alt={alt}
              width={2880}
              height={1800}
              sizes="(min-width: 1240px) 760px, (min-width: 900px) calc(100vw - 340px), 100vw"
              loading={eager ? 'eager' : undefined}
              className="block h-auto w-full"
            />
          </button>
          {pins(false)}
        </div>

        {/* The expand button sits under the picture, so it never covers what the markers point at. */}
        <figcaption className="mt-2 flex items-start justify-between gap-3 text-[13.5px] leading-normal text-ink-mute">
          <span className="pt-2.5">
            {caption}
            {more && (
              <>
                {' '}
                <Link href={more.href} className="whitespace-nowrap text-accent underline-offset-[3px] hover:underline">
                  {more.label} →
                </Link>
              </>
            )}
          </span>
          <button
            type="button"
            onClick={open}
            aria-label={labels.open}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-btn border border-line bg-surface-2 px-3 text-[13px] font-medium text-ink transition-colors hover:bg-surface-3"
          >
            <ExpandIcon className="size-4" />
            <span aria-hidden className="max-sm:hidden">
              {labels.open}
            </span>
          </button>
        </figcaption>
      </figure>

      {markers.length > 0 && (
        <ol aria-label={labels.legend} className="mt-3 grid gap-0.5">
          {markers.map((marker) => (
            <li key={marker.id}>
              <button
                type="button"
                aria-pressed={active === marker.id}
                // A plain set, not a toggle: a tap fires focus then click, and a toggle would undo the highlight.
                onClick={() => setActive(marker.id)}
                onMouseEnter={() => setActive(marker.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(marker.id)}
                onBlur={() => setActive(null)}
                className={cn(
                  'flex min-h-11 w-full items-start gap-3 rounded-lg px-2 py-2 text-left text-[15px] leading-normal text-ink transition-colors',
                  active === marker.id ? 'bg-surface' : 'hover:bg-surface',
                )}
              >
                <span aria-hidden className={cn(pin, 'mt-px size-[22px] text-[11.5px]', active === marker.id ? pinActive : pinIdle)}>
                  {marker.n}
                </span>
                <span className="[&_code]:rounded-[5px] [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.86em]">
                  {marker.label}
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <dialog
        ref={dialog}
        aria-label={alt}
        onClick={(event) => event.target === dialog.current && close()}
        onClose={() => setZoomed(false)}
        className="m-auto h-[92dvh] max-h-none w-[96vw] max-w-none overflow-hidden rounded-panel border border-line bg-ground p-0 text-ink backdrop:bg-black/75"
      >
        <div className="flex h-[58px] items-center justify-between gap-3 border-b border-line-soft pr-2 pl-4">
          <span className="truncate text-[13.5px] text-ink-mute">{alt}</span>
          <button
            type="button"
            onClick={close}
            aria-label={labels.close}
            className="grid size-11 shrink-0 place-items-center rounded-[9px] bg-surface-2"
          >
            <CloseIcon className="size-[18px]" />
          </button>
        </div>
        <div className="h-[calc(100%-58px)] overflow-auto overscroll-contain">
          {zoomed && (
            <div className="relative w-full min-w-[1440px]">
              <Image src={src} alt="" width={2880} height={1800} sizes="1440px" className="block h-auto w-full" />
              {pins(true)}
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};
