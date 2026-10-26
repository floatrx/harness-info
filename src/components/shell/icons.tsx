import type { ComponentProps } from 'react';

type IconProps = ComponentProps<'svg'>;

const Stroke = ({ children, ...props }: IconProps) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    {children}
  </svg>
);

/** The product mark (ours, not Claude's logo), from the approved dashboard. */
export const MarkIcon = (props: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden {...props}>
    <path d="M5 11a6 6 0 1 1 6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="11" cy="11" r="2.4" fill="currentColor" />
    <circle cx="5" cy="17" r="1.6" fill="currentColor" />
  </svg>
);

export const HomeIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M3.5 9 10 3.5 16.5 9v7.5h-4.5v-4.5h-4v4.5H3.5z" />
  </Stroke>
);

export const GuideIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M4 3.5h9.5a2 2 0 0 1 2 2v11H6a2 2 0 0 1-2-2z" />
    <path d="M4 14.5a2 2 0 0 1 2-2h9.5M7.5 7h5M7.5 9.5h3" />
  </Stroke>
);

export const DemoIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M3.5 6.5 10 3l6.5 3.5v7L10 17l-6.5-3.5z" />
    <path d="M3.5 6.5 10 10l6.5-3.5M10 10v7" />
  </Stroke>
);

export const ExampleIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M6 3.5h8a1 1 0 0 1 1 1V17l-5-3.2L5 17V4.5a1 1 0 0 1 1-1z" />
  </Stroke>
);

export const ExternalIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M7 4h9v9M16 4 5 15" />
  </Stroke>
);

export const ListIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M7.5 5.5h9M7.5 10h9M7.5 14.5h9" />
    <path d="M3.5 5.5h.5M3.5 10h.5M3.5 14.5h.5" strokeWidth="2.2" />
  </Stroke>
);

export const CloseIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M5 5l10 10M15 5 5 15" />
  </Stroke>
);

export const InfoIcon = (props: IconProps) => (
  <Stroke {...props}>
    <circle cx="10" cy="10" r="7" />
    <path d="M10 9v4.5M10 6.5v.2" />
  </Stroke>
);

export const GithubIcon = (props: IconProps) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export const ExpandIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M12 3.5h4.5V8M8 16.5H3.5V12M16.5 3.5l-5 5M3.5 16.5l5-5" />
  </Stroke>
);
