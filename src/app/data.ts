export const APP_LOCALE = 'pt-BR'

export type BookStatus = 'reading' | 'want' | 'finished'

export interface Book {
  id: string
  title: string
  author: string
  pages: number
  currentPage: number
  status: BookStatus
  color: string
  addedAt: number
  finishedAt?: number
  rating?: number
}

export interface Profile {
  name: string
  goal: number
  dailyGoal: number // pages per day
  reminders: boolean
}

export interface State {
  books: Book[]
  activity: Record<string, number> // date key -> pages logged that day
  profile: Profile
}

export const initialState: State = {
  books: [],
  activity: {},
  profile: { name: 'Leitor', goal: 30, dailyGoal: 20, reminders: true },
}

const COVER_COLORS = ['#4e6b5d', '#91605f', '#4a5d79', '#7a5c8c', '#a8762e', '#3f7570']

export function colorFor(title: string): string {
  const hash = [...title].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return COVER_COLORS[hash % COVER_COLORS.length]
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function calcStreak(activity: Record<string, number>): number {
  let streak = 0
  const d = new Date()
  // today without a log doesn't break the streak — count from yesterday
  if (!activity[dateKey(d)]) d.setDate(d.getDate() - 1)
  while (activity[dateKey(d)]) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

// indexed by getDay(): dom seg ter qua qui sex sáb
const DAY_LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const DAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

export function weekActivity(activity: Record<string, number>) {
  const out: { key: string; label: string; name: string; pages: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    out.push({ key: dateKey(d), label: DAY_LETTERS[d.getDay()], name: DAY_NAMES[d.getDay()], pages: activity[dateKey(d)] ?? 0 })
  }
  return out
}
