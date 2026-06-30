import type { SyncStatus } from '../types'

const STATUS_STYLES: Record<SyncStatus, string> = {
  synced: 'bg-rc-green/20 text-rc-green border-rc-green/60',
  pending_add: 'bg-rc-amber/20 text-rc-amber border-rc-amber/60',
  pending_remove: 'bg-rc-orange/20 text-rc-orange border-rc-orange/60',
  conflict: 'bg-rc-red/20 text-rc-red border-rc-red/60',
}

const STATUS_LABELS: Record<SyncStatus, string> = {
  synced: 'synced',
  pending_add: 'pending add',
  pending_remove: 'pending remove',
  conflict: 'conflict',
}

export function StatusBadge({ status }: { status: SyncStatus }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium border rounded ${STATUS_STYLES[status]}`}>
      {status === 'pending_add' && <span className="mr-1 animate-blink">▲</span>}
      {status === 'pending_remove' && <span className="mr-1">▼</span>}
      {status === 'conflict' && <span className="mr-1">!</span>}
      {STATUS_LABELS[status]}
    </span>
  )
}

export function FrontendBadge({ type }: { type: 'onion' | 'esde' }) {
  return type === 'onion'
    ? <span className="px-1.5 py-0.5 text-[10px] font-mono border border-rc-amber/70 text-rc-amber bg-rc-amber/15 rounded">OnionOS</span>
    : <span className="px-1.5 py-0.5 text-[10px] font-mono border border-rc-blue/70 text-rc-blue bg-rc-blue/15 rounded">ES-DE</span>
}

export function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border"
      style={{ borderColor: `${color}40`, color, backgroundColor: `${color}15` }}
    >
      {label}
    </span>
  )
}
