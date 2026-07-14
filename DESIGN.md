# EasyReads — Audible-inspired dark design system

The whole app runs a dark, focused "now playing" aesthetic inspired by Audible's
player: near-black surfaces, one warm orange accent doing all the signaling, and
motion that reinforces progress.

## Palette (CSS custom properties in `src/index.css` `:root`)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0e1016` | App/shell background |
| `--card` | `#181b25` | Raised card surfaces (gradient variant `#1a1d27 → #14161f` on `.card`) |
| `--raise` | `rgba(255,255,255,0.08)` | Neutral raised controls (buttons, pips) |
| `--ink` | `#f5f6fa` | Primary text |
| `--sub` / `--player-sub` | `#9aa0ad` | Secondary text |
| `--line` / `--player-line` | `rgba(255,255,255,0.08)` | Hairline borders |
| `--accent` / `--audible` | `#f8991c` | The accent: progress, CTAs, active states |
| `--audible-soft` | `#ffb54d` | Gradient head paired with `--audible` |

Rules: one accent only (orange). Primary CTAs use the orange gradient with
near-black text (`#16181f`). Neutral/secondary controls stay translucent white.
Destructive stays red text, never filled.

## The reading player card

Anatomy, top to bottom — mirrors Audible's player hierarchy (cover → scrubber →
transport controls → secondary actions):

1. **Header** — glowing mini cover (book color radiates behind the card),
   title/author, live percent readout that ticks over with a slide animation.
2. **Scrubber** — thick rounded track, orange gradient fill with a soft glow,
   a knob at the head, and a slow shimmer sweep across the fill (disabled under
   `prefers-reduced-motion`). Fill animates with a spring.
3. **Meta row** — `p. X / Y` is a *button*: tapping it turns it into a numeric
   input to set the exact page (Enter/blur commits, Esc cancels). Right side
   shows estimated time left (~1.5 min per page), like Audible's time remaining.
4. **Transport row** — round `−` and `+` steppers flanking a big editable
   amount ("N pages"), the direct analog of Audible's ∓30s buttons. `−` takes
   pages out (and rolls back today's activity), `+` logs them.
5. **Footer** — quick-amount chips (5 / 10 / 25) and the orange Finish pill.

Feedback: every log floats a `+N` / `−N` delta up from the percent readout.
Finishing a book animates the card out via `AnimatePresence`.

## Motion

- Springs (`stiffness ~260, damping ~24`) for progress and layout shifts.
- `whileTap` scale (0.88 on round buttons, 0.96 on pills).
- Shimmer sweep: 2.6s linear loop, CSS-only, `prefers-reduced-motion` aware.
- Percent readout: slide-up crossfade keyed on the value.

## Rules

- Player-card control styles are scoped (`.player-card .step-btn`,
  `.quick-chips .chip`) so they never leak into the Profile/Settings steppers
  or onboarding chips, which share class names.
- Interactive elements define `:hover` and a shared orange `:focus-visible`.
- Inputs accept digits only, clamp to `[0, pages]`; a 0-page log is a no-op.
- The activity ledger accepts negative deltas (floored at 0 per day) so
  corrections don't leave phantom pages in streaks and weekly bars.
