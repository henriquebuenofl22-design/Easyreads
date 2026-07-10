import { motion } from 'motion/react'
import { useStore } from '../store'
import { calcStreak, dateKey, weekActivity } from '../data'
import ReadingCard from '../ReadingCard'

function greeting(): string {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function Home({ onAdd }: { onAdd: () => void }) {
  const { state } = useStore()
  const { books, activity, profile } = state
  const reading = books.filter((b) => b.status === 'reading')
  const thisYear = new Date().getFullYear()
  const finished = books.filter(
    (b) => b.status === 'finished' && (!b.finishedAt || new Date(b.finishedAt).getFullYear() === thisYear),
  )
  const pagesRead = books.reduce((acc, b) => acc + b.currentPage, 0)
  const streak = calcStreak(activity)
  const week = weekActivity(activity)
  const maxWeek = Math.max(...week.map((w) => w.pages), 1)
  const goalPct = Math.min(1, finished.length / profile.goal)
  const todayPages = activity[dateKey(new Date())] ?? 0
  const dailyDone = todayPages >= profile.dailyGoal

  return (
    <>
      <header className="home-top">
        <div className="avatar">{profile.name.charAt(0).toUpperCase()}</div>
        <div>
          <span className="hello">{greeting()}</span>
          <h2>{profile.name}</h2>
        </div>
        <div className="streak-pill">🔥 {streak}</div>
      </header>

      <div className="card goal-card">
        <div className="goal-ring">
          <svg width="92" height="92" viewBox="0 0 92 92">
            <circle cx="46" cy="46" r="38" stroke="#f1f2f5" strokeWidth="9" fill="none" />
            <motion.circle
              cx="46"
              cy="46"
              r="38"
              stroke="#f59e0b"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 46 46)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: goalPct }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <span className="goal-ring-num">{finished.length}</span>
        </div>
        <div className="goal-info">
          <h3>
            {finished.length} of {profile.goal} books
          </h3>
          <p>{new Date().getFullYear()} reading goal</p>
          <div className="goal-chips">
            <span>📖 {pagesRead.toLocaleString()} pages</span>
            <span>📚 {books.length} on shelf</span>
          </div>
        </div>
      </div>

      <div className={`card today-card ${dailyDone ? 'done' : ''}`}>
        <span className="today-emoji">{dailyDone ? '🏆' : '🎯'}</span>
        <div className="today-info">
          <div className="read-title">{dailyDone ? 'Daily goal complete!' : 'Today’s goal'}</div>
          <div className="read-author">
            {todayPages} of {profile.dailyGoal} pages
          </div>
          <div className="pbar slim">
            <motion.div
              className="pbar-fill"
              animate={{ width: `${Math.min(100, (todayPages / profile.dailyGoal) * 100)}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            />
          </div>
        </div>
        <span className="today-pct">{Math.min(100, Math.round((todayPages / profile.dailyGoal) * 100))}%</span>
      </div>

      {books.length === 0 ? (
        <div className="card empty">
          <span className="empty-emoji">📚</span>
          <h3>Your shelf is empty</h3>
          <p>Register the book you’re reading and watch your progress grow.</p>
          <button className="cta" onClick={onAdd}>
            Add your first book
          </button>
        </div>
      ) : (
        <>
          <div className="sec">
            <h3>Currently reading</h3>
            <span>{reading.length} in progress</span>
          </div>
          {reading.length === 0 ? (
            <div className="card hint">Nothing in progress — start one from your shelf, or add a new book.</div>
          ) : (
            <div className="reading-row">
              {reading.map((b) => (
                <ReadingCard key={b.id} book={b} />
              ))}
            </div>
          )}

          <div className="sec">
            <h3>This week</h3>
            <span>{week.reduce((a, w) => a + w.pages, 0)} pages</span>
          </div>
          <div className="card chart-card">
            <div className="bars">
              {week.map((w) => (
                <div className="bar-col" key={w.key}>
                  <motion.div
                    className={`bar ${w.pages === 0 ? 'zero' : ''}`}
                    initial={{ height: '4px' }}
                    animate={{ height: w.pages === 0 ? '4px' : `${Math.max(10, (w.pages / maxWeek) * 100)}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                  />
                  <span className="bar-label">{w.label}</span>
                </div>
              ))}
            </div>
          </div>

          {finished.length > 0 && (
            <>
              <div className="sec">
                <h3>Finished</h3>
                <span>{finished.length} this year</span>
              </div>
              <div className="done-row">
                {finished.map((b) => (
                  <motion.div key={b.id} className="done-cover" style={{ background: b.color }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} title={b.title}>
                    <span className="done-cover-title">{b.title}</span>
                    <span className="done-check">✓</span>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
