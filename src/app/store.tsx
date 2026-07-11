import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { colorFor, dateKey, initialState, type Book, type BookStatus, type Profile, type State } from './data'

type Action =
  | { type: 'add'; title: string; author: string; pages: number; status: BookStatus }
  | { type: 'log'; id: string; delta: number }
  | { type: 'setStatus'; id: string; status: BookStatus }
  | { type: 'rate'; id: string; rating: number }
  | { type: 'remove'; id: string }
  | { type: 'profile'; patch: Partial<Profile> }
  | { type: 'reset' }

function addToday(activity: State['activity'], pages: number): State['activity'] {
  if (pages <= 0) return activity
  const k = dateKey(new Date())
  return { ...activity, [k]: (activity[k] ?? 0) + pages }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const finished = action.status === 'finished'
      const book: Book = {
        id: crypto.randomUUID(),
        title: action.title,
        author: action.author,
        pages: action.pages,
        currentPage: finished ? action.pages : 0,
        status: action.status,
        color: colorFor(action.title),
        addedAt: Date.now(),
        ...(finished ? { finishedAt: Date.now() } : {}),
      }
      return { ...state, books: [book, ...state.books] }
    }
    case 'log': {
      const target = state.books.find((b) => b.id === action.id)
      if (!target) return state
      const next = Math.min(target.pages, Math.max(0, target.currentPage + action.delta))
      const applied = next - target.currentPage
      const books = state.books.map((b) =>
        b.id === action.id
          ? {
              ...b,
              currentPage: next,
              ...(next >= b.pages ? { status: 'finished' as const, finishedAt: Date.now() } : {}),
            }
          : b,
      )
      return { ...state, books, activity: addToday(state.activity, applied) }
    }
    case 'setStatus': {
      let logged = 0
      const books = state.books.map((b) => {
        if (b.id !== action.id) return b
        if (action.status === 'finished') {
          logged = b.pages - b.currentPage
          return { ...b, status: 'finished' as const, currentPage: b.pages, finishedAt: Date.now() }
        }
        return { ...b, status: action.status, finishedAt: undefined }
      })
      return { ...state, books, activity: addToday(state.activity, logged) }
    }
    case 'rate': {
      const books = state.books.map((b) => (b.id === action.id ? { ...b, rating: action.rating } : b))
      return { ...state, books }
    }
    case 'remove':
      return { ...state, books: state.books.filter((b) => b.id !== action.id) }
    case 'profile':
      return { ...state, profile: { ...state.profile, ...action.patch } }
    case 'reset':
      return initialState
  }
}

const STORAGE_KEY = 'easyreads:v2'
// v1 is the pre-translation schema; kept in place as a recovery backup after migration
const LEGACY_STORAGE_KEY = 'easyreads:v1'

function sanitizeBooks(books: unknown): Book[] {
  return (Array.isArray(books) ? books : []).filter((b): b is Book => !!b && typeof b === 'object')
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<State>
      return {
        ...initialState,
        ...parsed,
        books: sanitizeBooks(parsed.books),
        profile: { ...initialState.profile, ...parsed.profile },
      }
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      const parsed = JSON.parse(legacy) as Partial<State>
      // one-time migration of app-supplied English defaults persisted by v1 builds;
      // the result is saved under STORAGE_KEY, so user-typed values are never rewritten again
      const books = sanitizeBooks(parsed.books).map((b) =>
        b.author === 'Unknown author' ? { ...b, author: 'Autor desconhecido' } : b,
      )
      const profile = { ...initialState.profile, ...parsed.profile }
      if (profile.name === 'Reader') profile.name = 'Leitor'
      return {
        ...initialState,
        ...parsed,
        books,
        profile,
      }
    }
  } catch {
    // corrupted storage — start fresh
  }
  return initialState
}

const StoreCtx = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])
  return <StoreCtx.Provider value={{ state, dispatch }}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
