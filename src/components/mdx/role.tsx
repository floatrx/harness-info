import type { ReactNode } from 'react';
import type { RoleId } from '@/config/roles';

import { getTranslations } from 'next-intl/server';

import { Avatar } from '@/components/diagrams/actor';
import { roleColor } from '@/config/roles';

interface Props {
  id: RoleId;
  input: string;
  output: string;
  verdict?: string;
  children: ReactNode;
}

/** One role, as a dashboard card: monogram and name, what it reads, what it writes, which verdict code expects. */
export const Role = async ({ id, input, output, verdict, children }: Props) => {
  const t = await getTranslations('doc');
  return (
    <section className="my-2.5 rounded-panel border border-line-soft bg-surface p-4">
      <h3 className="flex items-center gap-2.5 text-[16px] font-semibold" style={{ color: roleColor[id] }}>
        <Avatar actor={id} />
        {id}
      </h3>
      <div className="mt-2 text-[15px] leading-relaxed text-ink [&_p]:mb-0 [&_p]:text-[15px]">{children}</div>
      <dl className="mt-3 grid gap-x-5 gap-y-1 border-t border-line-soft pt-3 text-[14px] min-[900px]:grid-cols-[5.5rem_1fr]">
        <dt className="text-[12px] font-semibold text-ink-mute min-[900px]:pt-0.5">{t('roleIn')}</dt>
        <dd className="mb-1.5 text-ink min-[900px]:mb-0">{input}</dd>
        <dt className="text-[12px] font-semibold text-ink-mute min-[900px]:pt-0.5">{t('roleOut')}</dt>
        <dd className="mb-1.5 text-ink min-[900px]:mb-0">{output}</dd>
        {verdict && (
          <>
            <dt className="text-[12px] font-semibold text-ink-mute min-[900px]:pt-0.5">{t('roleVerdict')}</dt>
            <dd>
              <code className="rounded-[5px] bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] break-words text-ink">{verdict}</code>
            </dd>
          </>
        )}
      </dl>
    </section>
  );
};
