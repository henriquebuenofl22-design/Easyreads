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
        <h3>Configurações</h3>
        <div className="settings-list">
          <div className="field">
            <label htmlFor="set-name">Seu nome</label>
            <input
              id="set-name"
              value={profile.name}
              onChange={(e) => dispatch({ type: 'profile', patch: { name: e.target.value } })}
              placeholder="Seu nome"
            />
          </div>

          <div className="card goal-row">
            <div>
              <div className="read-title">Meta diária de leitura</div>
              <div className="read-author">{profile.dailyGoal} páginas por dia</div>
            </div>
            <div className="stepper">
              <button
                className="step-btn"
                onClick={() => dispatch({ type: 'profile', patch: { dailyGoal: Math.max(5, profile.dailyGoal - 5) } })}
                aria-label="Diminuir meta diária"
              >
                −
              </button>
              <span className="step-val">{profile.dailyGoal}</span>
              <button
                className="step-btn"
                onClick={() => dispatch({ type: 'profile', patch: { dailyGoal: Math.min(200, profile.dailyGoal + 5) } })}
                aria-label="Aumentar meta diária"
              >
                +
              </button>
            </div>
          </div>

          <div className="card goal-row">
            <div>
              <div className="read-title">Meta anual de livros</div>
              <div className="read-author">{profile.goal} livros em {new Date().getFullYear()}</div>
            </div>
            <div className="stepper">
              <button
                className="step-btn"
                onClick={() => dispatch({ type: 'profile', patch: { goal: Math.max(1, profile.goal - 1) } })}
                aria-label="Diminuir meta anual"
              >
                −
              </button>
              <span className="step-val">{profile.goal}</span>
              <button
                className="step-btn"
                onClick={() => dispatch({ type: 'profile', patch: { goal: Math.min(200, profile.goal + 1) } })}
                aria-label="Aumentar meta anual"
              >
                +
              </button>
            </div>
          </div>

          <div className="card goal-row">
            <div>
              <div className="read-title">Lembrete diário</div>
              <div className="read-author">Um empurrãozinho para bater sua meta de páginas</div>
            </div>
            <Toggle on={profile.reminders} onToggle={() => dispatch({ type: 'profile', patch: { reminders: !profile.reminders } })} />
          </div>

          <button className="ghost" onClick={onReplayIntro}>
            Rever introdução
          </button>

          <button className="signout" onClick={onSignOut}>
            Sair
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
            {confirmClear ? 'Toque de novo para apagar tudo' : 'Apagar todos os dados'}
          </button>
        </div>
      </motion.div>
    </>
  )
}
