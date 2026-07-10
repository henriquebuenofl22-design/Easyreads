import { motion } from 'motion/react'
import { useStore } from '../store'
import { calcStreak, dateKey } from '../data'

export default function Profile({ onOpenSettings, onSignOut }: { onOpenSettings: () => void; onSignOut: () => void }) {
  const { state, dispatch } = useStore()
  const { books, activity, profile } = state
  const finished = books.filter((b) => b.status === 'finished').length
  const thisYear = new Date().getFullYear()
  const finishedThisYear = books.filter(
    (b) => b.status === 'finished' && (!b.finishedAt || new Date(b.finishedAt).getFullYear() === thisYear),
  ).length
  const reading = books.filter((b) => b.status === 'reading').length
  const pagesRead = books.reduce((acc, b) => acc + b.currentPage, 0)
  const streak = calcStreak(activity)

  const achievements = [
    { emoji: '📕', name: 'First book', done: books.length >= 1 },
    { emoji: '📚', name: '5 on shelf', done: books.length >= 5 },
    { emoji: '✅', name: 'Finisher', done: finished >= 1 },
    { emoji: '🏆', name: '5 finished', done: finished >= 5 },
    { emoji: '📖', name: '1k pages', done: pagesRead >= 1000 },
    { emoji: '🔥', name: '3-day streak', done: streak >= 3 },
  ]

  const stats = [
    { num: finished, label: 'Books finished' },
    { num: pagesRead.toLocaleString(), label: 'Pages read' },
    { num: streak, label: 'Day streak' },
    { num: reading, label: 'Reading now' },
  ]

  const todayPages = state.activity[dateKey(new Date())] ?? 0

  return (
    <>
      <button className="settings-btn" onClick={onOpenSettings} aria-label="Settings">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
          <path
            d="M19.4 15a1.6 1.6 0 0 0 .32 1.76l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.76-.32 1.6 1.6 0 0 0-.97 1.47V21a2 2 0 1 1-4 0v-.09a1.6 1.6 0 0 0-1.05-1.47 1.6 1.6 0 0 0-1.76.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.6 1.6 0 0 0 4.6 15a1.6 1.6 0 0 0-1.47-.97H3a2 2 0 1 1 0-4h.09A1.6 1.6 0 0 0 4.56 9a1.6 1.6 0 0 0-.32-1.76l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.6 1.6 0 0 0 8.83 4.7 1.6 1.6 0 0 0 9.8 3.23V3a2 2 0 1 1 4 0v.09a1.6 1.6 0 0 0 .97 1.47 1.6 1.6 0 0 0 1.76-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.6 1.6 0 0 0 19.04 9c.21.5.7.84 1.24.87H21a2 2 0 1 1 0 4h-.09a1.6 1.6 0 0 0-1.51 1.13z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="profile-head">
        <div className="avatar big">{profile.name.charAt(0).toUpperCase()}</div>
        <input
          className="name-input"
          value={profile.name}
          onChange={(e) => dispatch({ type: 'profile', patch: { name: e.target.value } })}
          placeholder="Your name"
          aria-label="Your name"
        />
        <span className="member-note">EasyReads guest · tap your name to edit</span>
      </div>

      <div className="stat-grid">
        {stats.map((s, i) => (
          <motion.div key={s.label} className="card stat-cell" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <span className="stat-num">{s.num}</span>
            <span className="stat-lbl">{s.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="card goal-row">
        <div>
          <div className="read-title">{thisYear} goal</div>
          <div className="read-author">
            {finishedThisYear} of {profile.goal} books
          </div>
        </div>
        <div className="stepper">
          <button className="step-btn" onClick={() => dispatch({ type: 'profile', patch: { goal: Math.max(1, profile.goal - 1) } })} aria-label="Decrease goal">
            −
          </button>
          <span className="step-val">{profile.goal}</span>
          <button className="step-btn" onClick={() => dispatch({ type: 'profile', patch: { goal: Math.min(200, profile.goal + 1) } })} aria-label="Increase goal">
            +
          </button>
        </div>
      </div>

      <div className="card goal-row">
        <div>
          <div className="read-title">Daily goal {todayPages >= profile.dailyGoal && '✅'}</div>
          <div className="read-author">
            {todayPages} of {profile.dailyGoal} pages today
          </div>
        </div>
        <div className="goal-row-bar">
          <div className="pbar slim">
            <motion.div
              className="pbar-fill"
              animate={{ width: `${Math.min(100, (todayPages / profile.dailyGoal) * 100)}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            />
          </div>
        </div>
      </div>

      <div className="sec">
        <h3>Achievements</h3>
        <span>
          {achievements.filter((a) => a.done).length} of {achievements.length}
        </span>
      </div>
      <div className="ach-grid">
        {achievements.map((a, i) => (
          <motion.div
            key={a.name}
            className={`card ach ${a.done ? '' : 'locked'}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <span className="ach-emoji">{a.emoji}</span>
            <span className="ach-name">{a.name}</span>
          </motion.div>
        ))}
      </div>

      <button className="signout wide" onClick={onSignOut}>
        Sign out
      </button>
    </>
  )
}
