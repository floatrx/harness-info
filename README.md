# harness-info

A step-by-step guide (Ukrainian and English) to building and running an autonomous task harness for
[Claude Code](https://claude.com/claude-code): what a harness is, the roles, how a coordinator delegates
to specialists, the loop's contracts, and how to start, pause and stop it.

The harness itself lives in [floatrx/harness-demo](https://github.com/floatrx/harness-demo).

> **Status:** early. The site is being written.

## Develop

Requires Node 26 (`.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev              # http://localhost:3012 (redirects to /uk; /en for English)
pnpm build && pnpm exec tsc -b && pnpm lint
pnpm check:locales      # every page, message and caption exists in both languages
pnpm check:transitions  # the state-machine diagram matches harness-demo (needs ../harness-demo)
pnpm sync:shots         # copy the dashboard screenshots from ../harness-demo/docs/screenshots
pnpm check:shots        # the copies exist at 2880×1800 and are up to date
```

Page bodies are MDX in `src/content/<locale>/`; titles, goals and UI strings are in `src/messages/<locale>.json`.
The dashboard screenshots are generated in harness-demo and never edited here.

## License

MIT
