import { motion } from 'motion/react'
import { useStore } from '../store'
import { APP_LOCALE, calcStreak, dateKey, weekActivity } from '../data'

function greeting(): string {
  const h = new Date().getHours()
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
}

export default function Home({ onAdd }: { onAdd: () => void }) {
  const { state, dispatch } = useStore()
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
            <circle cx="46" cy="46" r="38" stroke="rgba(255,255,255,0.08)" strokeWidth="9" fill="none" />
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
            {finished.length} de {profile.goal} livros
          </h3>
          <p>Meta de leitura de {new Date().getFullYear()}</p>
          <div className="goal-chips">
            <span>📖 {pagesRead.toLocaleString(APP_LOCALE)} páginas</span>
            <span>📚 {books.length} na estante</span>
          </div>
        </div>
      </div>

      <div className={`card today-card ${dailyDone ? 'done' : ''}`}>
        <span className="today-emoji">{dailyDone ? '🏆' : '🎯'}</span>
        <div className="today-info">
          <div className="read-title">{dailyDone ? 'Meta diária concluída!' : 'Meta de hoje'}</div>
          <div className="read-author">
            {todayPages} de {profile.dailyGoal} páginas
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
          <h3>Sua estante está vazia</h3>
          <p>Cadastre o livro que você está lendo e veja seu progresso crescer.</p>
          <button className="cta" onClick={onAdd}>
            Adicione seu primeiro livro
          </button>
        </div>
      ) : (
        <>
          <div className="sec">
            <h3>Lendo agora</h3>
            <span>{reading.length} em andamento</span>
          </div>
          {reading.length === 0 ? (
            <div className="card hint">Nada em andamento — comece um livro da sua estante ou adicione um novo.</div>
          ) : (
            <div className="reading-row">
              {reading.map((b) => {
                const pct = Math.round((b.currentPage / b.pages) * 100)
                return (
                  <motion.div key={b.id} layout className="card read-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="read-card-top">
                      <span className="mini-cover" style={{ background: b.color }}>
                        {b.title.charAt(0)}
                      </span>
                      <div>
                        <div className="read-title">{b.title}</div>
                        <div className="read-author">{b.author}</div>
                      </div>
                    </div>
                    <div className="pbar">
                      <motion.div className="pbar-fill" animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} />
                    </div>
                    <div className="read-foot">
                      <span>
                        p. {b.currentPage} / {b.pages} · {pct}%
                      </span>
                      <div className="mini-btns">
                        <button className="mini-btn" onClick={() => dispatch({ type: 'log', id: b.id, delta: 10 })}>
                          +10 páginas
                        </button>
                        <button className="mini-btn dark" onClick={() => dispatch({ type: 'setStatus', id: b.id, status: 'finished' })}>
                          Concluir
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          <div className="sec">
            <h3>Esta semana</h3>
            <span>{week.reduce((a, w) => a + w.pages, 0)} páginas</span>
          </div>
          <div className="card chart-card">
            <div className="bars">
              {week.map((w) => (
                <div className="bar-col" key={w.key} title={w.name} aria-label={`${w.name}: ${w.pages} páginas`}>
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
                <h3>Concluídos</h3>
                <span>{finished.length} este ano</span>
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
