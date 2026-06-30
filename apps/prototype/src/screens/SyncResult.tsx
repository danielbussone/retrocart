import { useNavigate } from 'react-router-dom'
import { CheckCircle, AlertTriangle, ChevronRight, HardDrive } from 'lucide-react'
import { useApp, MOCK_SYNC_RESULT } from '../store/AppContext'
import { Button } from '../components/Button'

function fmtSize(b?: number): string {
  if (!b) return ''
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`
  if (b >= 1e6) return `${(b / 1e6).toFixed(0)} MB`
  return `${(b / 1e3).toFixed(0)} KB`
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function SyncResult() {
  const { setSyncResult, setSyncPlan } = useApp()
  const navigate = useNavigate()

  const result = MOCK_SYNC_RESULT
  const conflicts = result.filter(r => r.status === 'conflict')
  const ok = result.filter(r => r.status === 'ok')
  const totalBytes = result.reduce((s, r) => s + (r.bytes ?? 0), 0)

  function done() {
    setSyncResult(null)
    setSyncPlan(null)
    navigate('/library')
  }

  return (
    <div className="p-6 max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          conflicts.length > 0 ? 'bg-rc-red/10 border border-rc-red/30' : 'bg-rc-green/10 border border-rc-green/30'
        }`}>
          {conflicts.length > 0
            ? <AlertTriangle size={20} className="text-rc-red" />
            : <CheckCircle size={20} className="text-rc-green" />
          }
        </div>
        <div>
          <h1 className="text-lg font-semibold text-rc-text">
            {conflicts.length > 0 ? 'Sync complete with conflicts' : 'Sync complete'}
          </h1>
          <p className="text-sm text-rc-muted mt-0.5">
            {ok.length} operations succeeded · {fmtSize(totalBytes)} transferred
            {conflicts.length > 0 && ` · ${conflicts.length} conflict(s) renamed`}
          </p>
        </div>
        <div className="ml-auto">
          <Button variant="primary" onClick={done}>
            Done <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'ROMs copied', value: result.filter(r => r.action === 'ROM copied').length, color: '#3fb950' },
          { label: 'ROMs removed', value: result.filter(r => r.action === 'ROM removed').length, color: '#f0883e' },
          { label: 'Saves synced', value: result.filter(r => r.action.includes('Save') || r.action.includes('State')).length, color: '#58a6ff' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-rc-surface border border-rc-border rounded p-4 text-center">
            <div className="text-2xl font-mono font-semibold" style={{ color }}>{value}</div>
            <div className="text-xs text-rc-muted">{label}</div>
          </div>
        ))}
      </div>

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <div className="border border-rc-red/20 bg-rc-red/5 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-rc-red">
            <AlertTriangle size={14} /> {conflicts.length} conflict(s) — both copies preserved
          </div>
          {conflicts.map(r => (
            <div key={r.id} className="space-y-1 text-xs font-mono">
              <div className="text-rc-text">{r.title}</div>
              <div className="text-rc-dim">Canonical: <span className="text-rc-muted">{r.path}</span></div>
              {r.conflictPath && (
                <div className="text-rc-orange">Conflict copy: {r.conflictPath}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Eject hint */}
      <div className="flex items-center gap-3 p-4 border border-rc-border rounded-lg bg-rc-surface">
        <HardDrive size={16} className="text-rc-amber" />
        <div className="text-sm text-rc-muted">
          Safely eject <span className="text-rc-text font-mono">E:\</span> before removing the SD card.
          Use Windows system tray → Safely Remove Hardware.
        </div>
      </div>

      {/* Audit log */}
      <div className="bg-rc-surface border border-rc-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-rc-border text-xs font-mono text-rc-dim uppercase tracking-widest">
          Audit log
        </div>
        <div className="overflow-auto max-h-64">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 bg-rc-surface">
              <tr className="border-b border-rc-border">
                <th className="px-4 py-2 text-left font-mono text-[10px] text-rc-dim">Time</th>
                <th className="px-4 py-2 text-left font-mono text-[10px] text-rc-dim">Game</th>
                <th className="px-4 py-2 text-left font-mono text-[10px] text-rc-dim">Action</th>
                <th className="px-4 py-2 text-right font-mono text-[10px] text-rc-dim">Size</th>
                <th className="px-4 py-2 text-left font-mono text-[10px] text-rc-dim">Status</th>
              </tr>
            </thead>
            <tbody>
              {result.map(r => (
                <tr key={r.id} className="border-b border-rc-border/40 hover:bg-rc-surface2/60">
                  <td className="px-4 py-2 font-mono text-rc-dim text-[10px]">{fmtTime(r.timestamp)}</td>
                  <td className="px-4 py-2 font-mono text-rc-text truncate max-w-[180px]">{r.title}</td>
                  <td className="px-4 py-2 text-rc-muted">{r.action}</td>
                  <td className="px-4 py-2 font-mono text-rc-muted text-right">{fmtSize(r.bytes)}</td>
                  <td className="px-4 py-2">
                    <span className={`text-[10px] font-mono ${
                      r.status === 'ok' ? 'text-rc-green' : r.status === 'conflict' ? 'text-rc-red' : 'text-rc-orange'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
