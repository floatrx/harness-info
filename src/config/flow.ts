import type { RoleId } from './roles';

export type Owner = RoleId | 'human' | 'runner' | 'none';

/** The task state machine of harness-demo: one status = one board column = one owner. */
export const flow: { status: string; owner: Owner }[] = [
  { status: 'draft', owner: 'human' },
  { status: 'spec', owner: 'writer' },
  { status: 'needs-input', owner: 'human' },
  { status: 'plan', owner: 'planner' },
  { status: 'planned', owner: 'human' },
  { status: 'prototype', owner: 'designer' },
  { status: 'ready', owner: 'human' },
  { status: 'implementing', owner: 'implementer' },
  { status: 'qa', owner: 'qa' },
  { status: 'judge', owner: 'judge' },
  // With `deliver.pr` on, the runner pushes the branch and opens the pull request; no agent owns this column.
  { status: 'done', owner: 'runner' },
  { status: 'delivered', owner: 'none' },
  { status: 'parked', owner: 'human' },
];
