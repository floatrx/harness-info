interface Props {
  label: string;
  text: string;
}

/** The page goal under the title: a small "Goal" tag and one sentence. */
export const GoalLine = ({ label, text }: Props) => (
  <p className="mt-3 flex items-baseline gap-2.5 text-[16px] leading-normal text-pretty text-ink min-[900px]:text-[17px]">
    <span className="relative -top-0.5 shrink-0 rounded-md bg-surface-2 px-2 py-0.5 text-[12px] font-semibold text-ink-mute">{label}</span>
    <span>{text}</span>
  </p>
);
