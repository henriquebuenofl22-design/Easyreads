import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../store'
import type { Book } from '../data'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'reading', label: 'Reading' },
  { key: 'want', label: 'Want' },
  { key: 'finished', label: 'Done' },
] as const

type FilterKey = (typeof FILTERS)[number]['key']

function Stars({ book }: { book: Book }) {
  const { dispatch } = useStore()
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          className={`star ${(book.rating ?? 0) >= n ? 'on' : ''}`}
          onClick={() => dispatch({ type: 'rate', id: book.id, rating: n })}
          aria-label={`Rate ${n} stars`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function Library({ onAdd }: { onAdd: () => void }) {
  const { state, dispatch } = useStore()
  const [filter, setFilter] = useState<FilterKey>('all')
  const books = filter === 'all' ? state.books : state.books.filter((b) => b.status === filter)

  return (
    <>
      <div className="screen-head">
        <h2>My shelf</h2>
        <span>{state.books.length} books</span>
      </div>

      <div className="segmentbar">
        {FILTERS.map((f) => (
          <button key={f.key} className={`segbtn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
            {filter === f.key && <motion.span layoutId="shelf-seg" className="seg-pill" />}
            <span className="segbtn-label">{f.label}</span>
          </button>
        ))}
      </div>

      {books.length === 0 ? (
        <div className="card empty">
          <span className="empty-emoji">🔍</span>
          <h3>Nothing here yet</h3>
          <p>{state.books.length === 0 ? 'Register a book by name to start your shelf.' : 'No books match this filter.'}</p>
          {state.books.length === 0 && (
            <button className="cta" onClick={onAdd}>
              Add a book
            </button>
          )}
        </div>
      ) : (
        <AnimatePresence mode="popLayout" initial={false}>
          {books.map((b) => {
            const pct = Math.round((b.currentPage / b.pages) * 100)
            return (
              <motion.div
                key={b.id}
                layout
                className="card book-row"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              >
                <span className="mini-cover" style={{ background: b.color }}>
                  {b.title.charAt(0)}
                </span>
                <div className="book-row-body">
                  <div className="read-title">{b.title}</div>
                  <div className="read-author">{b.author}</div>
                  {b.status === 'reading' && (
                    <>
                      <div className="pbar slim">
                        <motion.div className="pbar-fill" animate={{ width: `${pct}%` }} />
                      </div>
                      <div className="row-actions">
                        <span className="row-meta">
                          p. {b.currentPage} / {b.pages}
                        </span>
                        <button className="mini-btn" onClick={() => dispatch({ type: 'log', id: b.id, delta: 10 })}>
                          +10
                        </button>
                        <button className="mini-btn dark" onClick={() => dispatch({ type: 'setStatus', id: b.id, status: 'finished' })}>
                          Finish
                        </button>
                      </div>
                    </>
                  )}
                  {b.status === 'want' && (
                    <div className="row-actions">
                      <span className="row-meta">{b.pages} pages</span>
                      <button className="mini-btn dark" onClick={() => dispatch({ type: 'setStatus', id: b.id, status: 'reading' })}>
                        Start reading
                      </button>
                    </div>
                  )}
                  {b.status === 'finished' && (
                    <div className="row-actions">
                      <Stars book={b} />
                      {b.finishedAt && (
                        <span className="row-meta">
                          {new Date(b.finishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button className="del" onClick={() => dispatch({ type: 'remove', id: b.id })} aria-label={`Remove ${b.title}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}
    </>
  )
}
