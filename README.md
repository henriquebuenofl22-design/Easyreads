# EasyReads

A book-tracking app: register the books you read by name, log pages daily, and watch your streaks, goals, and stats grow. Built with Vite, React 19, TypeScript, and Bun, animated with [motion](https://motion.dev).

## Features

- **Animated onboarding** — three pre-signup screens (cover scan, streak calendar, yearly goal ring) with swipe navigation and a guest mode.
- **Home dashboard** — yearly goal progress ring, daily page-goal card, currently-reading carousel with quick page logging (+10 páginas / Concluir), weekly activity chart, and a finished-books shelf.
- **Shelf (Estante)** — filterable library (Todos / Lendo / Quero ler / Lidos) with progress bars, 5-star ratings, finish dates, and delete.
- **Profile** — editable name, live stats (books finished, pages read, day streak), unlockable achievements, and sign out.
- **Settings** — daily reading goal (pages/day), yearly book goal, reminder toggle, replay intro, and a two-tap clear-all-data.

The UI is in Brazilian Portuguese (pt-BR); dates and numbers format with the pt-BR locale. Everything persists locally in `localStorage` (key `easyreads:v2` — data saved by the earlier English build migrates once automatically) — no backend required. Logging pages records per-day activity that powers the streak and weekly chart; reaching a book's last page auto-finishes it.

## Development

```bash
bun install
bun run dev      # dev server at http://localhost:5173
bun run build    # type-check (tsc -b) + production build
bun run lint     # oxlint
```

## Project layout

```
src/
  onboarding/   # pre-signup animated flow
  app/          # main app: store, data helpers, shell, sheets
    screens/    # Home, Library (Shelf), Profile
```

Versioning uses a 4-digit `VERSION` file (`MAJOR.MINOR.PATCH.MICRO`); see `CHANGELOG.md`.
