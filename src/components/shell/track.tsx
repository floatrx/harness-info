import { cn } from '@/lib/cn';

interface Props {
  total: number;
  /** The current segment; -1 before the first. */
  at: number;
  className?: string;
  height?: number;
}

/** The dashboard's stage track: past segments grey, the current one in the accent, the rest dark. */
export const Track = ({ total, at, className, height = 5 }: Props) => (
  <div aria-hidden className={cn('flex gap-[3px]', className)}>
    {Array.from({ length: total }, (_, index) => (
      <i
        key={index}
        className={cn('flex-1 rounded-full', index === at ? 'bg-accent' : index < at ? 'bg-track-past' : 'bg-track')}
        style={{ height }}
      />
    ))}
  </div>
);
