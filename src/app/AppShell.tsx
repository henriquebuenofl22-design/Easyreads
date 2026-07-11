import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Home from './screens/Home'
import Library from './screens/Library'
import Profile from './screens/Profile'
import AddBookSheet from './AddBookSheet'
import SettingsSheet from './SettingsSheet'

function HomeIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5M5.5 9v11h13V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShelfIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

const TABS = [
  { key: 'home', label: 'Início', Icon: HomeIcon },
  { key: 'shelf', label: 'Estante', Icon: ShelfIcon },
  { key: 'profile', label: 'Perfil', Icon: UserIcon },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function AppShell({
  onReplayIntro,
  onSignOut,
}: {
  onReplayIntro: () => void
  onSignOut: () => void
}) {
  const [tab, setTab] = useState<TabKey>('home')
  const [adding, setAdding] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="shell">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          className="screen"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {tab === 'home' && <Home onAdd={() => setAdding(true)} />}
          {tab === 'shelf' && <Library onAdd={() => setAdding(true)} />}
          {tab === 'profile' && <Profile onOpenSettings={() => setSettingsOpen(true)} onSignOut={onSignOut} />}
        </motion.div>
      </AnimatePresence>

      <motion.button className="fab" whileTap={{ scale: 0.88 }} onClick={() => setAdding(true)} aria-label="Adicionar um livro">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </motion.button>

      <nav className="tabbar">
        {TABS.map(({ key, label, Icon }) => (
          <button key={key} className={`tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
            <Icon />
            {label}
            {tab === key && <motion.span layoutId="tab-ind" className="tab-ind" />}
          </button>
        ))}
      </nav>

      <AnimatePresence>{adding && <AddBookSheet onClose={() => setAdding(false)} />}</AnimatePresence>
      <AnimatePresence>
        {settingsOpen && (
          <SettingsSheet onClose={() => setSettingsOpen(false)} onSignOut={onSignOut} onReplayIntro={onReplayIntro} />
        )}
      </AnimatePresence>
    </div>
  )
}
