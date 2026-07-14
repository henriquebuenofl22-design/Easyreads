import { useState, type ComponentType } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { GoalVisual, ScanVisual, StreakVisual } from './visuals'

type Slide = {
  key: string
  title: string
  subtitle: string
  Visual: ComponentType
  ambient: string
  glow: string
}

const SLIDES: Slide[] = [
  {
    key: 'scan',
    title: 'Acompanhe cada livro, sem esforço',
    subtitle: 'Fotografe a capa ou escaneie o ISBN — páginas, autor e edição são registrados para você em segundos.',
    Visual: ScanVisual,
    ambient: 'radial-gradient(120% 60% at 50% -8%, rgba(245, 158, 11, 0.20) 0%, rgba(245, 158, 11, 0) 60%)',
    glow: 'rgba(245, 158, 11, 0.22)',
  },
  {
    key: 'streak',
    title: 'Crie um hábito que realmente dura',
    subtitle: 'Metas diárias de páginas, lembretes gentis e sequências que tornam irresistível voltar ao livro.',
    Visual: StreakVisual,
    ambient: 'radial-gradient(120% 60% at 50% -8%, rgba(249, 115, 22, 0.22) 0%, rgba(249, 115, 22, 0) 60%)',
    glow: 'rgba(249, 115, 22, 0.24)',
  },
  {
    key: 'goal',
    title: 'Transforme páginas em progresso',
    subtitle: 'Defina uma meta anual, veja suas estatísticas subirem e celebre cada capítulo concluído.',
    Visual: GoalVisual,
    ambient: 'radial-gradient(120% 60% at 50% -8%, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0) 60%)',
    glow: 'rgba(16, 185, 129, 0.20)',
  },
]

const SWIPE_THRESHOLD = 70

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 160, opacity: 0, scale: 0.94, filter: 'blur(10px)' }),
  center: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: (dir: number) => ({ x: dir * -160, opacity: 0, scale: 0.94, filter: 'blur(10px)' }),
}

// Children add their own offset on top of the section's slide, creating a
// staggered parallax: the visual settles first, then title, then subtitle.
const childV = (delay: number): Variants => ({
  enter: (dir: number) => ({ x: dir * 70, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { delay, type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: (dir: number) => ({ x: dir * -50, opacity: 0, transition: { duration: 0.16 } }),
})

function ArrowIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
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
      <div className="onb-ambient" aria-hidden>
        {SLIDES.map((s, i) => (
          <motion.div
            key={s.key}
            className="ambient-layer"
            style={{ background: s.ambient }}
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />
        ))}
        <motion.div
          className="ambient-orb"
          animate={{ background: `radial-gradient(circle, ${slide.glow}, transparent 68%)`, x: [-14, 14, -14], y: [-10, 12, -10] }}
          transition={{
            background: { duration: 0.7 },
            x: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      </div>

      <header className="onb-top">
        <motion.button
          className="back"
          onClick={() => go(index - 1)}
          animate={{ opacity: index > 0 ? 1 : 0, scale: index > 0 ? 1 : 0.8 }}
          whileTap={{ scale: 0.9 }}
          style={{ pointerEvents: index > 0 ? 'auto' : 'none' }}
          aria-label="Voltar"
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
          Pular
        </button>
      </header>

      <div className="onb-body">
        <AnimatePresence custom={dir} initial={false} mode="popLayout">
          <motion.section
            key={slide.key}
            className="slide"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              scale: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.28 },
              filter: { duration: 0.28 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) go(index + 1)
              else if (info.offset.x > SWIPE_THRESHOLD) go(index - 1)
            }}
          >
            <motion.div className="slide-visual" variants={childV(0.05)}>
              <slide.Visual />
            </motion.div>
            <motion.h1 variants={childV(0.12)}>{slide.title}</motion.h1>
            <motion.p variants={childV(0.19)}>{slide.subtitle}</motion.p>
          </motion.section>
        </AnimatePresence>
      </div>

      <footer className="onb-foot">
        <div className="dots">
          {SLIDES.map((s, i) => (
            <motion.button
              key={s.key}
              className="dot"
              onClick={() => go(i)}
              animate={{ width: i === index ? 24 : 7, backgroundColor: i === index ? '#ffffff' : 'rgba(255,255,255,0.22)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              aria-label={`Ir para o passo ${i + 1}`}
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
              <motion.button className="cta" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.015 }} onClick={() => onFinish('signup')}>
                Começar
                <motion.span
                  className="cta-arrow"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 }}
                >
                  <ArrowIcon />
                </motion.span>
              </motion.button>
              <button className="ghost" onClick={() => onFinish('guest')}>
                Continuar como visitante
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
              <motion.button className="cta" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.015 }} onClick={() => go(index + 1)}>
                Continuar
                <motion.span
                  className="cta-arrow"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 }}
                >
                  <ArrowIcon />
                </motion.span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  )
}
