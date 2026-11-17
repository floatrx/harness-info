You are going to help me build an autonomous task harness for Claude Code around my own work, and a dashboard to run it.
A harness is a meta-program around Claude Code: it gives the agent one unit of work at a time, checks the result with
code instead of trusting the agent, and keeps all its state in files.

This prompt is in English, but I may not be. Your very first message asks which language to use for the whole job,
with a few options (English, Ukrainian, another); after my answer, use only that language. Do not write code until step 4.

## 1. Learn the harness first

Read the guide at https://harness-info.vercel.app — start from https://harness-info.vercel.app/llms.txt, which lists every
page with its goal. Read at least: Concepts, Roles, Task lifecycle, Contracts, Your own project, Build your own dashboard.
The reference implementation is https://github.com/floatrx/harness-demo (MIT). Name only commands, flags, config keys and
files that harness-demo really has; when unsure, read its README or CLI instead of guessing.

## 2. Interview me — one question per message

Ask one question at a time, in the language I chose. Offer 2–4 concrete options and mark the one you recommend; I can always answer in my own words.
Ask only what changes the design. Look up facts in my repository yourself instead of asking me. Cover, in this order:

1. **Why** I want a harness: what hurts today, and what a good week with it looks like.
2. **Which tasks** it should take: real examples from my backlog, and what must never be handed to it.
3. **The real-world flow** of one such task, step by step, as it happens today — from the first request to "done",
   including the reviews, the waiting and the rework.
4. **The people** in that flow: every role (author, reviewer, tester, designer, lead, customer…), what each one
   reads, what each one decides, and where a human decision must stay human.
5. **What "done" means**: the checks that prove it — tests, lint, a build, a screenshot, a review.
6. **Where I want to watch it**: what I need to see on a dashboard to trust a run I did not watch.

## 3. Map my flow onto the harness — and wait for my "ok"

Show one table, then stop and wait for my approval:

| My world              | Harness                                                      |
| --------------------- | ------------------------------------------------------------ |
| each person or role   | a coordinator or a specialist agent (one Markdown file each) |
| each step of the flow | a stage and a task status                                    |
| each human decision   | a gate where the task waits for me                           |
| each "done" check     | a contract or the project gate command                       |
| what I want to watch  | a dashboard screen and its widgets                           |

Mark every decision you made on your own, and say which alternatives you rejected and why.

## 4. Set it up on my repository

After my "ok":

1. Clone harness-demo next to my project, `pnpm install`, run `harness self-test`, and confirm all cases pass.
2. Register my repository with `harness projects add <path> --name <name>`, then set `.harness/config.json` (gate, autonomy,
   limits) from the interview.
3. Write my specialists into `<project>/.claude/agents/`, then run `harness agents --sync` and `harness agents --check`.
4. Create one small real task with `harness new`, check its prompt with `harness preview`, and run it with
   `--once-through` while I watch `pnpm dashboard`.

## 5. Build my dashboard

Follow https://harness-info.vercel.app/en/build-dashboard phase by phase. Start each phase by writing its plan in a file
and showing it to me. Use Next.js 16 + motion + HeroUI 3 + Tailwind 4 unless my project already uses another stack.
Every number on a screen needs a real source; with no source, show an honest empty state, never a made-up value.

Standing rules for the whole job: no commits, pushes or branches without my explicit approval; never kill a process you
did not start; stop and ask when an action is destructive or outward-facing.

Start now: read the guide, then ask me which language to use. Ask question 1 only after I answer.
