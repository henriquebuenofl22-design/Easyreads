import { useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { GoalVisual, ScanVisual, StreakVisual } from './visuals'

type Slide = { key: string; title: string; subtitle: string; Visual: ComponentType }

const SLIDES: Slide[] = [
  {
    key: 'scan',
    title: 'Track every book, effortlessly',
    subtitle: 'Snap a cover or scan the ISBN — pages, author and edition are logged for you in seconds.',
    Visual: ScanVisual,
  },
  {
    key: 'streak',
    title: 'Build a habit that actually sticks',
    subtitle: 'Daily page goals, gentle nudges and streaks that make picking the book back up irresistible.',
    Visual: StreakVisual,
  },
  {
    key: 'goal',
    title: 'Turn pages into progress',
    subtitle: 'Set a yearly goal, watch your stats climb, and celebrate every finished chapter.',
    Visual: GoalVisual,
  },
]

const variants = {
  enter: (dir: number) => ({ x: dir * 90, opacity: 0, filter: 'blur(6px)' }),
  center: { x: 0, opacity: 1, filter: 'blur(0px)' },
  exit: (dir: number) => ({ x: dir * -90, opacity: 0, filter: 'blur(6px)' }),
}

export default function Onboarding({ onFinish }: { onFinish: (mode: 'signup' | 'guest') => void }) {
  const [[index, dir], setPage] = useState<[number, number]>([0, 0])
  const last = index === SLIDES.length - 1
  const slide = SLIDES[index]

  const go = (next: number) => {
    if (next < 0 || next >= SLIDES.length || next === index) return
    setPage([next, next > index ? 1 : -1])
  }

  return (
    <div className="onb">
      <header className="onb-top">
        <motion.button
          className="back"
          onClick={() => go(index - 1)}
          animate={{ opacity: index > 0 ? 1 : 0, scale: index > 0 ? 1 : 0.8 }}
          style={{ pointerEvents: index > 0 ? 'auto' : 'none' }}
          aria-label="Back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
        <div className="segments">
          {SLIDES.map((s, i) => (
            <div className="seg" key={s.key}>
              <motion.div
                className="seg-fill"
                initial={false}
                animate={{ scaleX: i <= index ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              />
            </div>
          ))}
        </div>
        <button
          className="skip"
          onClick={() => go(SLIDES.length - 1)}
          style={{ visibility: last ? 'hidden' : 'visible' }}
        >
          Skip
        </button>
      </header>

      <div className="onb-body">
        <AnimatePresence custom={dir} initial={false} mode="popLayout">
          <motion.section
            key={slide.key}
            className="slide"
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 320, damping: 32 },
              opacity: { duration: 0.25 },
              filter: { duration: 0.25 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) go(index + 1)
              else if (info.offset.x > 70) go(index - 1)
            }}
          >
            <div className="slide-visual">
              <slide.Visual />
            </div>
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
          </motion.section>
        </AnimatePresence>
      </div>

      <footer className="onb-foot">
        <div className="dots">
          {SLIDES.map((s, i) => (
            <motion.span
              key={s.key}
              className="dot"
              animate={{ width: i === index ? 24 : 7, backgroundColor: i === index ? '#f8991c' : 'rgba(255,255,255,0.18)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {last ? (
            <motion.div
              key="final"
              className="cta-col"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button className="cta" whileTap={{ scale: 0.97 }} onClick={() => onFinish('signup')}>
                Get started
              </motion.button>
              <button className="ghost" onClick={() => onFinish('guest')}>
                Continue as guest
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="next"
              className="cta-col"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button className="cta" whileTap={{ scale: 0.97 }} onClick={() => go(index + 1)}>
                Continue
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  )
}
