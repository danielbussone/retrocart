import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

export function Modal({ title, onClose, children, wide }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 flex flex-col bg-rc-surface border border-rc-border2 rounded shadow-xl max-h-[90vh] ${wide ? 'w-[90vw] max-w-5xl' : 'w-[520px]'}`}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-rc-border">
          <h2 className="text-sm font-semibold text-rc-text">{title}</h2>
          <button onClick={onClose} className="text-rc-muted hover:text-rc-text transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
