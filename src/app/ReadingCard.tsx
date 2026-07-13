import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from './store'
import type { Book } from './data'

const QUICK = [5, 10, 25]
const DEFAULT_AMOUNT = '10'
const MINUTES_PER_PAGE = 1.5
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const

function timeLeft(pagesLeft: number): string {
  const mins = Math.round(pagesLeft * MINUTES_PER_PAGE)
  if (mins < 60) return `≈ ${mins} min left`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `≈ ${h}h${m > 0 ? ` ${m}m` : ''} left`
}

export default function ReadingCard({ book }: { book: Book }) {
  const { dispatch } = useStore()
  const [amountStr, setAmountStr] = useState(DEFAULT_AMOUNT)
  const [editingPage, setEditingPage] = useState(false)
  const [pageDraft, setPageDraft] = useState('')
  const [pop, setPop] = useState<{ key: number; delta: number } | null>(null)

  const amount = Math.max(0, parseInt(amountStr, 10) || 0)
  const pct = Math.round((book.currentPage / book.pages) * 100)

  useEffect(() => {
    if (!pop) return
    const t = setTimeout(() => setPop(null), 850)
    return () => clearTimeout(t)
  }, [pop])

  const log = (delta: number) => {
    const applied = Math.min(book.pages, Math.max(0, book.currentPage + delta)) - book.currentPage
    if (applied === 0) return
    dispatch({ type: 'log', id: book.id, delta: applied })
    setPop({ key: Date.now(), delta: applied })
  }

  const commitPage = () => {
    setEditingPage(false)
    const n = parseInt(pageDraft, 10)
    if (Number.isNaN(n)) return
    log(n - book.currentPage)
  }

  return (
    <motion.div
      layout
      className="player-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={spring}
    >
      <div className="player-glow" style={{ background: book.color }} />

      <div className="player-top">
        <span className="player-cover" style={{ background: book.color }}>
          {book.title.charAt(0)}
        </span>
        <div className="player-meta">
          <div className="player-title">{book.title}</div>
          <div className="player-author">{book.author}</div>
        </div>
        <div className="player-pct">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={pct}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {pct}%
            </motion.span>
          </AnimatePresence>
          <AnimatePresence>
            {pop && (
              <motion.span
                key={pop.key}
                className={`pop-delta ${pop.delta < 0 ? 'neg' : ''}`}
                initial={{ opacity: 0, y: 6, scale: 0.8 }}
                animate={{ opacity: 1, y: -20, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {pop.delta > 0 ? `+${pop.delta}` : pop.delta}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="player-track">
        <motion.div className="player-fill" animate={{ width: `${pct}%` }} transition={spring}>
          <span className="player-shimmer" />
        </motion.div>
        <motion.span className="player-knob" animate={{ left: `${pct}%` }} transition={spring} />
      </div>

      <div className="player-info">
        {editingPage ? (
          <input
            autoFocus
            className="page-input"
            inputMode="numeric"
            value={pageDraft}
            onChange={(e) => setPageDraft(e.target.value.replace(/\D/g, ''))}
            onBlur={commitPage}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitPage()
              if (e.key === 'Escape') setEditingPage(false)
            }}
            aria-label="Set current page"
          />
        ) : (
          <button
            className="page-btn"
            onClick={() => {
              setPageDraft(String(book.currentPage))
              setEditingPage(true)
            }}
            title="Tap to set the exact page"
          >
            p. <strong>{book.currentPage}</strong> / {book.pages}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <span className="time-left">{timeLeft(book.pages - book.currentPage)}</span>
      </div>

      <div className="player-controls">
        <motion.button
          whileTap={{ scale: 0.88 }}
          className="step-btn"
          onClick={() => log(-amount)}
          disabled={book.currentPage === 0 || amount === 0}
          aria-label={`Take out ${amount} pages`}
        >
          −
        </motion.button>
        <div className="amount-box">
          <input
            className="amount-input"
            inputMode="numeric"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="0"
            aria-label="Pages to log"
          />
          <span className="amount-label">pages</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.88 }}
          className="step-btn plus"
          onClick={() => log(amount)}
          disabled={book.currentPage >= book.pages || amount === 0}
          aria-label={`Add ${amount} pages`}
        >
          +
        </motion.button>
      </div>

      <div className="player-foot">
        <div className="quick-chips">
          {QUICK.map((q) => (
            <button key={q} className={`chip ${amount === q ? 'on' : ''}`} onClick={() => setAmountStr(String(q))}>
              {q}
            </button>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="finish-btn"
          onClick={() => dispatch({ type: 'setStatus', id: book.id, status: 'finished' })}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Finish
        </motion.button>
      </div>
    </motion.div>
  )
}
