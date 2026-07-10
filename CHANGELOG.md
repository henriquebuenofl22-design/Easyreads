# Changelog

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
