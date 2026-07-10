import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from './store'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button className={`switch ${on ? 'on' : ''}`} onClick={onToggle} role="switch" aria-checked={on}>
      <motion.span layout className="knob" transition={{ type: 'spring', stiffness: 500, damping: 32 }} />
    </button>
  )
}

export default function SettingsSheet({
  onClose,
  onSignOut,
  onReplayIntro,
}: {
  onClose: () => void
  onSignOut: () => void
  onReplayIntro: () => void
}) {
  const { state, dispatch } = useStore()
  const { profile } = state
  const [confirmClear, setConfirmClear] = useState(false)

  return (
    <>
      <motion.div className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        className="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
      >
        <div className="sheet-handle" />
        <h3>Settings</h3>
        <div className="settings-list">
          <div className="field">
            <label htmlFor="set-name">Your name</label>
            <input
              id="set-name"
              value={profile.name}
              onChange={(e) => dispatch({ type: 'profile', patch: { name: e.target.value } })}
              placeholder="Your name"
            />
          </div>

          <div className="card goal-row">
            <div>
              <div className="read-title">Daily reading goal</div>
              <div className="read-author">{profile.dailyGoal} pages a day</div>
            </div>
            <div className="stepper">
              <button
                className="step-btn"
                onClick={() => dispatch({ type: 'profile', patch: { dailyGoal: Math.max(5, profile.dailyGoal - 5) } })}
                aria-label="Decrease daily goal"
              >
                −
              </button>
              <span className="step-val">{profile.dailyGoal}</span>
              <button
                className="step-btn"
                onClick={() => dispatch({ type: 'profile', patch: { dailyGoal: Math.min(200, profile.dailyGoal + 5) } })}
                aria-label="Increase daily goal"
              >
                +
              </button>
            </div>
          </div>

          <div className="card goal-row">
            <div>
              <div className="read-title">Yearly book goal</div>
              <div className="read-author">{profile.goal} books in {new Date().getFullYear()}</div>
            </div>
            <div className="stepper">
              <button
                className="step-btn"
                onClick={() => dispatch({ type: 'profile', patch: { goal: Math.max(1, profile.goal - 1) } })}
                aria-label="Decrease yearly goal"
              >
                −
              </button>
              <span className="step-val">{profile.goal}</span>
              <button
                className="step-btn"
                onClick={() => dispatch({ type: 'profile', patch: { goal: Math.min(200, profile.goal + 1) } })}
                aria-label="Increase yearly goal"
              >
                +
              </button>
            </div>
          </div>

          <div className="card goal-row">
            <div>
              <div className="read-title">Daily reminder</div>
              <div className="read-author">A nudge to hit your page goal</div>
            </div>
            <Toggle on={profile.reminders} onToggle={() => dispatch({ type: 'profile', patch: { reminders: !profile.reminders } })} />
          </div>

          <button className="ghost" onClick={onReplayIntro}>
            Replay intro
          </button>

          <button className="signout" onClick={onSignOut}>
            Sign out
          </button>

          <button
            className={`danger ${confirmClear ? 'confirm' : ''}`}
            onClick={() => {
              if (!confirmClear) {
                setConfirmClear(true)
                return
              }
              dispatch({ type: 'reset' })
              setConfirmClear(false)
              onClose()
            }}
          >
            {confirmClear ? 'Tap again to erase everything' : 'Clear all data'}
          </button>
        </div>
      </motion.div>
    </>
  )
}
