// Compares the state-machine diagram's edges with the real transitions module of harness-demo.
// Usage: node scripts/check-transitions.ts   (HARNESS_DEMO_DIR overrides ../harness-demo; skips when it is absent)
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.join(import.meta.dirname, '..');
const demoDir = process.env.HARNESS_DEMO_DIR ?? path.join(root, '..', 'harness-demo');
const modulePath = path.join(demoDir, 'harness', 'task', 'transitions.ts');

if (!existsSync(modulePath)) {
  console.log(`Transition check skipped: ${modulePath} not found.`);
  process.exit(0);
}

const real = await import(pathToFileURL(modulePath).href);
const mirror = JSON.parse(readFileSync(path.join(root, 'src', 'config', 'diagrams', 'states.json'), 'utf8'));

// Actions whose source is one half of the prototype node.
const portActions = new Set(['accept', 'comment', 'prototype-done', 'auto-accept']);

const mirrorKeys = new Set<string>();
for (const edge of mirror.edges) {
  mirrorKeys.add(`${edge.actor}:${edge.action}:${edge.from}${edge.fromPort ? `/${edge.fromPort}` : ''}->${edge.to}`);
}
mirrorKeys.add(`${mirror.park.actor}:${mirror.park.action}:*->parked`);
mirrorKeys.add(`${mirror.reopen.actor}:${mirror.reopen.action}:${mirror.reopen.from}->*`);

const realKeys = new Set<string>();
const parkFrom = new Set<string>();
const kinds = ['ui', 'logic'];
const resumes = ['spec', 'plan', null];
const prototypes = ['drafting', 'review', null];
const parkedFroms = ['implementing', null];

for (const actor of ['human', 'agent'] as const) {
  for (const transition of real.transitionsFor(actor)) {
    const froms: string[] = transition.from === '*' ? [...real.STATUSES] : [transition.from];
    for (const status of froms)
      for (const kind of kinds)
        for (const resume of resumes)
          for (const prototype of prototypes)
            for (const parkedFrom of parkedFroms)
              for (const bounces of [0, 1])
                for (const openQuestions of [0, 1])
                  for (const autonomy of ['gated', 'full'])
                    for (const mergeQaJudge of [false, true]) {
                      const task = { status, kind, resume, prototype, parkedFrom, bounces, openQuestions };
                      const ctx = { autonomy, mergeQaJudge, bounceCap: 2 };
                      if (transition.guard && !transition.guard(task, ctx)) continue;
                      const target = transition.to(task);
                      if (!target) continue;
                      if (transition.from === '*') parkFrom.add(status);
                      const from = transition.from === '*' ? '*' : status;
                      const port = status === 'prototype' && portActions.has(transition.action) && prototype ? `/${prototype}` : '';
                      const to = transition.action === 'reopen' ? '*' : target;
                      realKeys.add(`${actor}:${transition.action}:${from}${port}->${to}`);
                    }
  }
}

const problems: string[] = [];
for (const key of realKeys) if (!mirrorKeys.has(key)) problems.push(`missing in the diagram: ${key}`);
for (const key of mirrorKeys) if (!realKeys.has(key)) problems.push(`not in harness-demo: ${key}`);
const expectedPark = real.STATUSES.filter((status: string) => !mirror.park.except.includes(status));
for (const status of expectedPark) if (!parkFrom.has(status)) problems.push(`park is not allowed from ${status} in harness-demo`);
for (const status of parkFrom) if (!expectedPark.includes(status)) problems.push(`park from ${status} is missing in the diagram`);

// Column owners: the board's `config/flow.ts` names a role where harness-demo says 'agent'.
const flowSource = readFileSync(path.join(root, 'src', 'config', 'flow.ts'), 'utf8');
const owners = new Map([...flowSource.matchAll(/status: '([a-z-]+)', owner: '([a-z-]+)'/g)].map((match) => [match[1], match[2]]));
const ownerKind = (owner: string) => (['human', 'runner', 'none'].includes(owner) ? owner : 'agent');
for (const status of real.STATUSES as string[]) {
  const mirrored = owners.get(status);
  if (!mirrored) problems.push(`config/flow.ts has no owner for ${status}`);
  else if (real.OWNER && ownerKind(mirrored) !== real.OWNER[status])
    problems.push(`owner of ${status}: the site says ${mirrored}, harness-demo says ${real.OWNER[status]}`);
}

if (problems.length) {
  console.error(`Transition check failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`Transition check passed: ${realKeys.size} transitions and ${owners.size} column owners match harness-demo.`);
