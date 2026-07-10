# EasyReads — Reading Player design notes

Direction for the "Currently reading" card, inspired by Audible's player screen:
a dark, focused "now playing" surface inside the otherwise light app, with one
warm accent doing all the signaling.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--player-bg` | `#191c26 → #10121a` gradient | Player card surface |
| `--player-line` | `rgba(255,255,255,0.08)` | Hairline borders on dark |
| `--audible` | `#f8991c` | Accent: progress, +N pop, active chip, Finish CTA |
| `--audible-soft` | `#ffb54d` | Gradient head of the progress fill |
| `--player-sub` | `#9aa0ad` | Secondary text on dark |

Everything else in the app keeps the existing light theme (`--ink`, `--accent`).

## The player card

Anatomy, top to bottom — mirrors Audible's player hierarchy (cover → scrubber →
transport controls → secondary actions):

1. **Header** — glowing mini cover (book color radiates behind the card),
   title/author, live percent readout that ticks over with a slide animation.
2. **Scrubber** — thick rounded track, orange gradient fill with a soft glow,
   a knob at the head, and a slow shimmer sweep across the fill (the
   "technological" pulse). Fill animates with a spring.
3. **Meta row** — `p. X / Y` is a *button*: tapping it turns it into a numeric
   input to set the exact page (Enter/blur commits, Esc cancels). Right side
   shows estimated time left (~1.5 min per page), like Audible's time remaining.
4. **Transport row** — round `−` and `+` steppers flanking a big editable
   amount ("N pages"), the direct analog of Audible's ∓30s buttons. `−` takes
   pages out, `+` logs them. The amount itself is a numeric input.
5. **Footer** — quick-amount chips (5 / 10 / 25) and the orange Finish pill.

Feedback: every log floats a `+N` / `−N` delta up from the percent readout.

## Motion

- Springs (`stiffness ~260, damping ~24`) for progress and layout shifts.
- `whileTap` scale (0.88 on round buttons, 0.96 on pills).
- Shimmer sweep: 2.6s linear loop, CSS-only.
- Percent readout: slide-up crossfade keyed on the value.

## Rules

- One accent on the dark card: orange. No competing colors.
- Destructive/decrement stays neutral (ghost button), never red.
- Inputs accept digits only, clamp to `[0, pages]`; a 0-page log is a no-op.
