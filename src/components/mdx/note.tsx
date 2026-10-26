import { InfoIcon } from '@/components/shell/icons';

interface Props {
  title?: string;
}

/** A short aside that the reader must not miss, as a dashboard panel. */
export const Note: FC<Props> = ({ title, children }) => (
  <aside className="my-5 rounded-panel border border-line bg-surface px-4 py-3.5 text-ink [&_p]:mb-0 [&_p]:text-[15.5px]">
    {title && (
      <p className="!mb-1.5 flex items-center gap-2 !text-[13px] font-semibold text-ink">
        <InfoIcon className="size-4 text-ink-mute" />
        {title}
      </p>
    )}
    <div className="text-[15.5px] leading-relaxed">{children}</div>
  </aside>
);
