import { useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import Onboarding from './onboarding/Onboarding'
import AppShell from './app/AppShell'
import { StoreProvider } from './app/store'

const ONBOARDED_KEY = 'easyreads:onboarded'

export default function App() {
  const [stage, setStage] = useState<'onboarding' | 'app'>(() =>
    localStorage.getItem(ONBOARDED_KEY) ? 'app' : 'onboarding',
  )

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <AnimatePresence mode="wait">
          {stage === 'onboarding' ? (
            <motion.div
              key="onb"
              className="fill"
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
              transition={{ duration: 0.3 }}
            >
              <Onboarding
                onFinish={(mode) => {
                  localStorage.setItem(ONBOARDED_KEY, mode)
                  setStage('app')
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="shell"
              className="fill"
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            >
              <StoreProvider>
                <AppShell
                  onReplayIntro={() => {
                    localStorage.removeItem(ONBOARDED_KEY)
                    setStage('onboarding')
                  }}
                  onSignOut={() => {
                    localStorage.removeItem(ONBOARDED_KEY)
                    setStage('onboarding')
                  }}
                />
              </StoreProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
