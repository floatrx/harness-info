import type { Heading } from '@/lib/content';

interface Props {
  headings: Heading[];
  title: string;
}

/** Collapsed table of contents while the dock is hidden; works without JavaScript. */
export const MobileToc = ({ headings, title }: Props) => (
  <details className="group rounded-panel border border-line-soft bg-surface">
    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 py-2.5 text-[14px] font-medium text-ink">
      {title}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-5 text-ink-mute transition-transform group-open:rotate-180"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </summary>
    <ul className="grid px-2 pb-3">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            className="flex min-h-11 items-center rounded-md px-2 text-[14px] text-ink-soft hover:bg-surface-2 hover:text-ink"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  </details>
);
