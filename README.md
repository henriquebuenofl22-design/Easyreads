# EasyReads

A book-tracking app: register the books you read by name, log pages daily, and watch your streaks, goals, and stats grow. Built with Vite, React 19, TypeScript, and Bun, animated with [motion](https://motion.dev).

## Features

- **Animated onboarding** — three pre-signup screens (cover scan, streak calendar, yearly goal ring) with swipe navigation and a guest mode.
- **Home dashboard** — yearly goal progress ring, daily page-goal card, an Audible-style reading player per book in progress, weekly activity chart, and a finished-books shelf.
- **Reading player** — each currently-reading book gets a player card: − / + steppers to take out or add pages, quick-amount chips (5 / 10 / 25), tap "p. X / Y" to set the exact page, an animated progress scrubber with percent, an estimated time left (~1.5 min per page), and a Finish pill.
- **Shelf** — filterable library (All / Reading / Want / Done) with progress bars, −10 / +10 page logging on reading rows, 5-star ratings, finish dates, and delete.
- **Profile** — editable name, live stats (books finished, pages read, day streak), unlockable achievements, and sign out.
- **Settings** — daily reading goal (pages/day), yearly book goal, reminder toggle, replay intro, and a two-tap clear-all-data.

Everything persists locally in `localStorage` — no backend required. Logging pages records per-day activity that powers the streak and weekly chart; taking pages out rolls back today's count (floored at zero), and reaching a book's last page auto-finishes it.

The app-wide dark, Audible-inspired look (design tokens, player anatomy, motion rules) is documented in [DESIGN.md](DESIGN.md).

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
  app/          # main app: store, data helpers, shell, sheets, reading player card
    screens/    # Home, Library (Shelf), Profile
```

Versioning uses a 4-digit `VERSION` file (`MAJOR.MINOR.PATCH.MICRO`); see `CHANGELOG.md`.
