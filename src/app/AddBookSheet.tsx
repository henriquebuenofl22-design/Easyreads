import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from './store'
import type { BookStatus } from './data'

const STATUSES: { key: BookStatus; label: string }[] = [
  { key: 'reading', label: 'Lendo agora' },
  { key: 'want', label: 'Quero ler' },
  { key: 'finished', label: 'Concluído' },
]

export default function AddBookSheet({ onClose }: { onClose: () => void }) {
  const { dispatch } = useStore()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [pages, setPages] = useState('')
  const [status, setStatus] = useState<BookStatus>('reading')

  const submit = () => {
    if (!title.trim()) return
    dispatch({
      type: 'add',
      title: title.trim(),
      author: author.trim() || 'Autor desconhecido',
      pages: Math.max(1, parseInt(pages, 10) || 300),
      status,
    })
    onClose()
  }

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
        <h3>Adicionar um livro</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <div className="field">
            <label htmlFor="bk-title">Título</label>
            <input id="bk-title" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ex.: A Biblioteca da Meia-Noite" />
          </div>
          <div className="field-row">
            <div className="field grow">
              <label htmlFor="bk-author">Autor</label>
              <input id="bk-author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Matt Haig" />
            </div>
            <div className="field pages">
              <label htmlFor="bk-pages">Páginas</label>
              <input id="bk-pages" value={pages} onChange={(e) => setPages(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="304" />
            </div>
          </div>
          <div className="field">
            <label>Situação</label>
            <div className="segmentbar">
              {STATUSES.map((s) => (
                <button type="button" key={s.key} className={`segbtn ${status === s.key ? 'active' : ''}`} onClick={() => setStatus(s.key)}>
                  {status === s.key && <motion.span layoutId="add-seg" className="seg-pill" />}
                  <span className="segbtn-label">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          <motion.button type="submit" className="cta" disabled={!title.trim()} whileTap={{ scale: 0.97 }}>
            Adicionar à estante
          </motion.button>
        </form>
      </motion.div>
    </>
  )
}
