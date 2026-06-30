import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp, ArrowDown, ArrowUpDown, ImageIcon, AlertTriangle, Check } from 'lucide-react'
import { useApp, MOCK_SYNC_PLAN, MOCK_SYNC_RESULT } from '../store/AppContext'
import { Tabs } from '../components/Tabs'
import { ConsoleBadge } from '../components/ConsoleBadge'
import { Button } from '../components/Button'

function fmtSize(b: number): string {
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`
  if (b >= 1e6) return `${(b / 1e6).toFixed(0)} MB`
  return `${(b / 1e3).toFixed(0)} KB`
}

export function SyncDiff() {
  const { setSyncResult } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('roms')
  const [applying, setApplying] = useState(false)

  const plan = MOCK_SYNC_PLAN
  const adds = plan.romOps.filter(o => o.action === 'add')
  const removes = plan.romOps.filter(o => o.action === 'remove')
  const conflicts = plan.saveOps.filter(o => o.isConflict)
  const addBytes = adds.reduce((s, o) => s + o.sizeBytes, 0)
  const removeBytes = removes.reduce((s, o) => s + o.sizeBytes, 0)

  function apply() {
    setApplying(true)
    setTimeout(() => {
      setSyncResult(MOCK_SYNC_RESULT)
      navigate('/sync/result')
    }, 1800)
  }

  const tabs = [
    { id: 'roms', label: 'ROMs', badge: plan.romOps.length, badgeVariant: 'amber' as const },
    { id: 'saves', label: 'Saves', badge: plan.saveOps.length, badgeVariant: 'amber' as const },
    { id: 'media', label: 'Media', badge: plan.mediaUpdates, badgeVariant: 'green' as const },
    { id: 'conflicts', label: 'Conflicts', badge: conflicts.length, badgeVariant: 'red' as const },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-3 border-b border-rc-border flex items-center gap-4 shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-rc-text">Sync Diff Preview</h1>
          <div className="text-xs text-rc-muted font-mono mt-0.5">{plan.mountPath} · Miyoo Mini Plus</div>
        </div>
        {conflicts.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-rc-red/30 bg-rc-red/5 text-xs text-rc-red font-mono">
            <AlertTriangle size={12} /> {conflicts.length} conflicts need review
          </div>
        )}
        <div className="flex-1" />
        <Button variant="ghost" onClick={() => navigate('/sync')}>Cancel</Button>
        <Button variant="primary" disabled={applying} onClick={apply}>
          {applying ? <><span className="animate-spin inline-block mr-1">⟳</span> Applying...</> : <>Apply sync</>}
        </Button>
      </div>

      {/* Net change bar */}
      <div className="px-6 py-2.5 border-b border-rc-border bg-rc-surface flex items-center gap-6 text-xs font-mono shrink-0">
        <span className="text-rc-green flex items-center gap-1"><ArrowUp size={11} /> {adds.length} ROMs (+{fmtSize(addBytes)})</span>
        <span className="text-rc-orange flex items-center gap-1"><ArrowDown size={11} /> {removes.length} ROMs (−{fmtSize(removeBytes)})</span>
        <span className="text-rc-blue flex items-center gap-1"><ArrowUpDown size={11} /> {plan.saveOps.length} save ops</span>
        <span className="text-rc-muted">{plan.mediaUpdates} media files</span>
        <span className="ml-auto text-rc-muted">Net: {fmtSize(addBytes - removeBytes)} change</span>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs tabs={tabs} active={tab} onChange={setTab}>
          {/* ROMs tab */}
          {tab === 'roms' && (
            <div className="p-4 space-y-4">
              {adds.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono text-rc-green uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ArrowUp size={10} /> {adds.length} ROMs to copy to device
                  </div>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-rc-border">
                        <th className="px-3 py-2 text-left font-mono text-[10px] text-rc-dim">Title</th>
                        <th className="px-3 py-2 text-left font-mono text-[10px] text-rc-dim">Console</th>
                        <th className="px-3 py-2 text-left font-mono text-[10px] text-rc-dim">Filename</th>
                        <th className="px-3 py-2 text-right font-mono text-[10px] text-rc-dim">Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adds.map(op => (
                        <tr key={op.id} className="border-b border-rc-border/40 hover:bg-rc-surface2/60">
                          <td className="px-3 py-2 font-mono text-rc-text">{op.title}</td>
                          <td className="px-3 py-2"><ConsoleBadge console={op.console} /></td>
                          <td className="px-3 py-2 font-mono text-rc-dim text-[10px] truncate max-w-[200px]">{op.filename}</td>
                          <td className="px-3 py-2 font-mono text-rc-green text-right">+{fmtSize(op.sizeBytes)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {removes.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono text-rc-orange uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ArrowDown size={10} /> {removes.length} ROMs to remove from device
                  </div>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-rc-border">
                        <th className="px-3 py-2 text-left font-mono text-[10px] text-rc-dim">Title</th>
                        <th className="px-3 py-2 text-left font-mono text-[10px] text-rc-dim">Console</th>
                        <th className="px-3 py-2 text-right font-mono text-[10px] text-rc-dim">Size freed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {removes.map(op => (
                        <tr key={op.id} className="border-b border-rc-border/40 hover:bg-rc-surface2/60">
                          <td className="px-3 py-2 font-mono text-rc-text">{op.title}</td>
                          <td className="px-3 py-2"><ConsoleBadge console={op.console} /></td>
                          <td className="px-3 py-2 font-mono text-rc-orange text-right">−{fmtSize(op.sizeBytes)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Saves tab */}
          {tab === 'saves' && (
            <div className="p-4">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-rc-border">
                    <th className="px-3 py-2 text-left font-mono text-[10px] text-rc-dim">Game</th>
                    <th className="px-3 py-2 text-left font-mono text-[10px] text-rc-dim">Type</th>
                    <th className="px-3 py-2 text-left font-mono text-[10px] text-rc-dim">Direction</th>
                    <th className="px-3 py-2 text-left font-mono text-[10px] text-rc-dim">Status</th>
                    <th className="px-3 py-2 text-left font-mono text-[10px] text-rc-dim">Path</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.saveOps.map(op => (
                    <tr key={op.id} className={`border-b border-rc-border/40 hover:bg-rc-surface2/60 ${op.isConflict ? 'bg-rc-red/5' : ''}`}>
                      <td className="px-3 py-2 font-mono text-rc-text">{op.title}</td>
                      <td className="px-3 py-2 font-mono text-rc-muted uppercase text-[10px]">{op.kind}</td>
                      <td className="px-3 py-2">
                        <span className={`flex items-center gap-1 text-[10px] font-mono ${op.direction === 'pull' ? 'text-rc-blue' : 'text-rc-amber'}`}>
                          {op.direction === 'pull' ? <ArrowDown size={10} /> : <ArrowUp size={10} />}
                          {op.direction} from {op.direction === 'pull' ? 'device' : 'vault'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {op.isConflict
                          ? <span className="flex items-center gap-1 text-[10px] text-rc-red font-mono"><AlertTriangle size={10} /> conflict</span>
                          : <span className="flex items-center gap-1 text-[10px] text-rc-green font-mono"><Check size={10} /> ok</span>
                        }
                      </td>
                      <td className="px-3 py-2 font-mono text-[10px] text-rc-dim truncate max-w-[240px]">
                        {op.devicePath}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Media tab */}
          {tab === 'media' && (
            <div className="p-6 flex flex-col items-center justify-center text-center gap-3 text-rc-muted">
              <ImageIcon size={32} className="text-rc-dim" />
              <div className="text-sm">
                <div className="text-rc-text font-medium mb-1">{plan.mediaUpdates} media assets to sync</div>
                <div className="text-xs text-rc-muted">Boxart and screenshots will be copied to <span className="font-mono">E:\Imgs\</span></div>
                <div className="text-xs text-rc-dim mt-2">Media is matched by ROM filename stem. No scraping occurs during sync.</div>
              </div>
            </div>
          )}

          {/* Conflicts tab */}
          {tab === 'conflicts' && (
            <div className="p-4 space-y-3">
              <div className="p-3 rounded border border-rc-amber/20 bg-rc-amber/5 text-xs text-rc-muted">
                <strong className="text-rc-amber">Conflict policy:</strong> Newer file wins. Both copies are renamed with a timestamp suffix — no silent overwrites.
              </div>
              {conflicts.map(op => (
                <div key={op.id} className="border border-rc-red/20 bg-rc-red/5 rounded p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-rc-red">
                    <AlertTriangle size={14} />
                    {op.title} — {op.kind.toUpperCase()} conflict
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                    <div className="space-y-1">
                      <div className="text-rc-dim">Device copy</div>
                      <div className="text-rc-text bg-rc-surface2 rounded p-2 break-all">{op.devicePath}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-rc-dim">Vault copy</div>
                      <div className="text-rc-text bg-rc-surface2 rounded p-2 break-all">{op.vaultPath}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-rc-orange font-mono">
                    ↳ Older copy renamed to: <span className="text-rc-text">{op.conflictRename}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Tabs>
      </div>

      {/* Apply progress overlay */}
      {applying && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-rc-surface border border-rc-border rounded-lg p-8 w-80 space-y-4 text-center">
            <div className="text-rc-amber text-2xl animate-spin inline-block">⟳</div>
            <div className="text-sm font-semibold text-rc-text">Applying sync...</div>
            <div className="text-xs text-rc-muted">Copying ROMs, pulling saves, writing metadata</div>
            <div className="h-1 bg-rc-surface3 rounded-full overflow-hidden">
              <div className="h-full bg-rc-amber rounded-full animate-pulse-slow w-2/3" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
