/** The ten base roles, in stage order. Each colour is reused by every diagram and table that names the role. */
export const roleIds = ['writer', 'explorer', 'planner', 'designer', 'tester', 'implementer', 'debugger', 'qa', 'judge'] as const;

export type RoleId = (typeof roleIds)[number];

/** The hue of each role's monogram, the same as on the harness-demo dashboard. */
export const roleHue: Record<RoleId, number> = {
  writer: 215,
  explorer: 185,
  planner: 160,
  designer: 315,
  tester: 48,
  implementer: 130,
  debugger: 22,
  qa: 95,
  judge: 350,
};

/** Two-letter monograms, as on the dashboard cards. */
export const roleMonogram: Record<RoleId, string> = {
  writer: 'Wr',
  explorer: 'Ex',
  planner: 'Pl',
  designer: 'Ds',
  tester: 'Ts',
  implementer: 'Im',
  debugger: 'Db',
  qa: 'QA',
  judge: 'Jd',
};

// Literal var() names: Tailwind keeps only the theme variables it can find in the source.
export const roleColor: Record<RoleId, string> = {
  writer: 'var(--color-role-writer)',
  explorer: 'var(--color-role-explorer)',
  planner: 'var(--color-role-planner)',
  designer: 'var(--color-role-designer)',
  tester: 'var(--color-role-tester)',
  implementer: 'var(--color-role-implementer)',
  debugger: 'var(--color-role-debugger)',
  qa: 'var(--color-role-qa)',
  judge: 'var(--color-role-judge)',
};
