import type { ReactNode } from 'react';

import { type ActorId, Avatar, isRole } from '@/components/diagrams/actor';

// Labels that name an actor in the MDX tables, in both locales.
const named: Record<string, ActorId> = {
  runner: 'runner',
  harness: 'harness',
  coordinator: 'coordinator',
  координатор: 'coordinator',
  you: 'human',
  ти: 'human',
};

const actorOf = (label: string): ActorId | null => named[label] ?? (isRole(label) ? label : null);

/** A table cell that only names actors ("runner", "explorer, planner", "ти") gets their monograms, as on the dashboard. */
export const withActors = (children: ReactNode): ReactNode => {
  if (typeof children !== 'string') return children;
  const parts = children.split(/,\s*/).map((part) => part.trim());
  const actors = parts.map(actorOf);
  if (actors.some((actor) => actor === null)) return children;
  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      {parts.map((part, index) => {
        const actor = actors[index] as ActorId;
        return (
          <span key={part} className="inline-flex items-center gap-[7px] whitespace-nowrap">
            <Avatar actor={actor} you={part.charAt(0).toUpperCase() + part.slice(1)} />
            {actor !== 'human' && part}
          </span>
        );
      })}
    </span>
  );
};
