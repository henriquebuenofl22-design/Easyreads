# Changelog

## 0.2.0.0 — 2026-07-13

### Added
- **Reading player**: the "Currently reading" card is now an Audible-style player. Take pages out with the round − button, add them with +, type any amount directly (with 5 / 10 / 25 quick chips), or tap "p. X / Y" to set the exact page you're on (Enter/blur saves, Esc cancels). Shows percent, an animated glowing progress scrubber, and an estimated time left based on ~1.5 min per page.
- **Take out pages on the Shelf** too: reading rows gained a −10 button next to +10.
- Logging feedback: every log floats a +N / −N delta, the percent ticks over with an animation, and finishing a book animates its card away instead of vanishing.

### Changed
- **App-wide Audible-inspired dark theme**: every screen — onboarding, home, shelf, profile, settings, and the add-book sheet — now uses near-black surfaces with a single warm orange accent for progress, CTAs, and active states. Design tokens and rules are documented in DESIGN.md.
- Progress bars, goal rings, weekly chart bars, streak pips, switches, and the floating add button all adopt the orange accent.

### Fixed
- Taking pages out now also rolls back today's activity count (floored at zero), so corrections no longer leave phantom pages in the daily goal, streaks, and weekly chart.
- The player's stepper and chip styles no longer leak into the Profile/Settings goal steppers and onboarding chips.
- The shimmer animation respects `prefers-reduced-motion`, and player controls gained hover and keyboard-focus states.

## 0.1.0.0 — 2026-07-10

First release of EasyReads, a book-tracking app (Vite + React 19 + TypeScript + Bun, animated with `motion`).

### Added
- **Onboarding**: 3 animated pre-signup screens in the Cal AI style (cover-scan demo, streak calendar, yearly goal ring) with swipe navigation, progress segments, skip/back, and "Get started" / "Continue as guest" CTAs. Completion is remembered in localStorage.
- **Home dashboard**: greeting header with streak pill, yearly goal progress ring, daily page-goal card with live progress, "Currently reading" carousel with +10 pages / Finish quick actions, weekly pages bar chart, finished-books shelf, and empty states.
- **Book registration**: floating + button opens a bottom sheet — title (required), author, pages, and status (Reading now / Want to read / Finished). Covers get auto-assigned colors.
- **Shelf**: filterable library (All / Reading / Want / Done) with progress bars, start-reading and finish actions, 5-star ratings on finished books, finish dates, and delete.
- **Profile**: editable name, live stats grid (books finished, pages read, day streak, reading now), yearly goal stepper, daily-goal progress row, 6 unlockable achievements, and sign out.
- **Settings**: gear-button sheet with name, daily reading goal (pages/day), yearly book goal, reminder toggle, replay intro, sign out, and two-tap "Clear all data".
- **Data layer**: reducer store persisted to localStorage with per-day activity log powering streaks and the weekly chart; auto-finish when the last page is logged; migration-safe profile defaults.

### Fixed
- Yearly goal ring, "Finished this year" count, and the Profile goal row now filter finished books by the current year, so counts stay correct after a year rollover.
