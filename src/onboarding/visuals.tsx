import { useEffect, useState } from 'react'
import { animate, motion } from 'motion/react'

function Counter({ to, delay = 0, duration = 1.1 }: { to: number; delay?: number; duration?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const controls = animate(0, to, {
      delay,
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [to, delay, duration])
  return <>{val}</>
}

/* ---------- Slide 1: scan a cover, book gets logged ---------- */

const SPARKS = [
  { x: -128, y: -100, delay: 0, size: 15 },
  { x: 126, y: -66, delay: 0.9, size: 12 },
  { x: -112, y: 64, delay: 1.7, size: 11 },
  { x: 118, y: -128, delay: 0.5, size: 14 },
]

export function ScanVisual() {
  return (
    <div className="book-fan">
      {SPARKS.map((s, i) => (
        <motion.span
          key={i}
          className="spark"
          style={{ left: `calc(50% + ${s.x}px)`, top: `calc(50% + ${s.y}px)`, fontSize: s.size }}
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 100] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        >
          ✦
        </motion.span>
      ))}
      <motion.div
        className="book book-l"
        initial={{ opacity: 0, rotate: -4, y: 26, x: 0 }}
        animate={{ opacity: 1, rotate: -13, y: 8, x: -38 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 20 }}
      />
      <motion.div
        className="book book-r"
        initial={{ opacity: 0, rotate: 4, y: 26, x: 0 }}
        animate={{ opacity: 1, rotate: 13, y: 8, x: 38 }}
        transition={{ delay: 0.22, type: 'spring', stiffness: 180, damping: 20 }}
      />
      <motion.div
        className="book book-main"
        initial={{ opacity: 0, y: 34, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 200, damping: 22 }}
      >
        <span className="book-kicker">UM ROMANCE</span>
        <span className="book-title">A Biblioteca da Meia-Noite</span>
        <span className="book-author">MATT HAIG</span>
        <motion.div
          className="scanline"
          animate={{ top: ['7%', '90%', '7%'], opacity: [0, 1, 1, 1, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
        />
      </motion.div>
      <motion.div
        className="scan-result"
        initial={{ opacity: 0, y: 18, scale: 0.85, rotate: 0 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
        transition={{ delay: 1.15, type: 'spring', stiffness: 260, damping: 18 }}
      >
        <span className="result-check">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>
          <span className="result-title">A Biblioteca da Meia-Noite</span>
          <span className="result-meta">Matt Haig · 304 páginas</span>
        </span>
      </motion.div>
    </div>
  )
}

/* ---------- Slide 2: streaks and weekly rhythm ---------- */

// Monday-first display order: seg ter qua qui sex sáb dom
const WEEK = [
  { d: 'S', s: 'done' },
  { d: 'T', s: 'done' },
  { d: 'Q', s: 'done' },
  { d: 'Q', s: 'done' },
  { d: 'S', s: 'done' },
  { d: 'S', s: 'today' },
  { d: 'D', s: 'future' },
] as const

export function StreakVisual() {
  return (
    <div className="streak-visual">
      <div className="flame-orb">
        <span className="flame-ring">
          <svg viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="70" stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
            <motion.circle
              cx="75"
              cy="75"
              r="70"
              stroke="url(#flameGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 0.8 }}
              transition={{ delay: 0.2, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            />
            <defs>
              <linearGradient id="flameGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fbbf24" />
                <stop offset="1" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <motion.span
          className="flame-glow"
          animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0.35, 0.7] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="flame"
          animate={{ scale: [1, 1.07, 0.98, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          🔥
        </motion.span>
      </div>
      <div className="streak-count">
        <span className="streak-num">
          <Counter to={12} delay={0.4} />
        </span>
        dias seguidos
      </div>
      <div className="week-card">
        {WEEK.map((w, i) => (
          <div className="day" key={i}>
            <span className="day-label">{w.d}</span>
            {w.s === 'done' && (
              <motion.span
                className="day-pip done"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35 + i * 0.12, type: 'spring', stiffness: 320, damping: 16 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.span>
            )}
            {w.s === 'today' && (
              <motion.span
                className="day-pip today"
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: 1.3 }}
              >
                📖
              </motion.span>
            )}
            {w.s === 'future' && <span className="day-pip future" />}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Slide 3: yearly goal ring ---------- */

const CONFETTI = [
  { x: -70, y: -88, c: '#f59e0b', delay: 1.5 },
  { x: 62, y: -96, c: '#ef4444', delay: 1.6 },
  { x: 96, y: -30, c: '#3b82f6', delay: 1.55 },
  { x: -98, y: -20, c: '#10b981', delay: 1.65 },
  { x: 40, y: -120, c: '#8b5cf6', delay: 1.7 },
  { x: -30, y: -116, c: '#f97316', delay: 1.5 },
]

const CHIPS = ['🔥 12 dias seguidos', '⏱ 8h 24m neste mês', '📖 6.120 páginas']

export function GoalVisual() {
  return (
    <div className="goal-visual">
      <div className="ring-wrap">
        {CONFETTI.map((c, i) => (
          <motion.span
            key={i}
            className="confetti-dot"
            style={{ background: c.c }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{ x: c.x, y: c.y, scale: [0, 1.2, 1], opacity: [0, 1, 0], rotate: 160 }}
            transition={{ delay: c.delay, duration: 1.1, ease: 'easeOut' }}
          />
        ))}
        <svg width="210" height="210" viewBox="0 0 210 210">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <circle cx="105" cy="105" r="88" stroke="rgba(255,255,255,0.08)" strokeWidth="17" fill="none" />
          <motion.circle
            cx="105"
            cy="105"
            r="88"
            stroke="url(#ringGrad)"
            strokeWidth="17"
            strokeLinecap="round"
            fill="none"
            transform="rotate(-90 105 105)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 0.8 }}
            transition={{ delay: 0.35, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="ring-center">
          <span className="ring-num">
            <Counter to={24} delay={0.35} duration={1.4} />
          </span>
          <span className="ring-sub">de 30 livros em {new Date().getFullYear()}</span>
        </div>
      </div>
      <div className="chips">
        {CHIPS.map((c, i) => (
          <motion.span
            key={c}
            className="chip"
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.14, type: 'spring', stiffness: 260, damping: 20 }}
          >
            {c}
          </motion.span>
        ))}
      </div>
    </div>
  )
}
