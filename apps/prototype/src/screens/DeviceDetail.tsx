import { useParams, useNavigate } from 'react-router-dom'
import { RefreshCw, Tag, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { useApp, useDeviceStats } from '../store/AppContext'
import { StorageBar } from '../components/StorageBar'
import { FrontendBadge, StatusBadge } from '../components/Badge'
import { ConsoleBadge } from '../components/ConsoleBadge'
import { Button } from '../components/Button'

function StatCard({ icon: Icon, label, value, color }: { icon: React.FC<any>; label: string; value: number; color: string }) {
  return (
    <div className="bg-rc-surface2 border border-rc-border rounded p-4 flex items-center gap-3">
      <Icon size={18} style={{ color }} />
      <div>
        <div className="text-xl font-mono font-semibold text-rc-text">{value}</div>
        <div className="text-xs text-rc-muted">{label}</div>
      </div>
    </div>
  )
}

function fmtSize(b: number): string {
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`
  if (b >= 1e6) return `${(b / 1e6).toFixed(0)} MB`
  return `${(b / 1e3).toFixed(0)} KB`
}

export function DeviceDetail() {
  const { deviceId } = useParams<{ deviceId: string }>()
  const { devices, library, toggleDeviceTag, setActiveSyncDeviceId } = useApp()
  const navigate = useNavigate()

  const device = devices.find(d => d.id === deviceId)
  const stats = useDeviceStats(deviceId ?? '')
  const tagged = library.filter(i => !!i.deviceTags[deviceId ?? ''])
  const hasPending = stats.pendingAdd > 0 || stats.pendingRemove > 0 || stats.conflict > 0

  if (!device) return <div className="p-8 text-rc-muted">Device not found.</div>

  function openSync() {
    setActiveSyncDeviceId(device!.id)
    navigate('/sync')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-lg font-semibold text-rc-text">{device.name}</h1>
            <FrontendBadge type={device.frontendType} />
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-rc-muted">
            <span>Mount hint: <span className="text-rc-text">{device.mountLabelHint}</span></span>
            <span>Mock path: <span className="text-rc-text">{device.mockMountPath}</span></span>
          </div>
        </div>
        <Button variant="primary" onClick={openSync} disabled={!hasPending}>
          <RefreshCw size={13} />
          {hasPending ? `Sync (${stats.pendingAdd + stats.pendingRemove + stats.conflict} pending)` : 'Up to date'}
        </Button>
      </div>

      {/* Storage */}
      <div className="bg-rc-surface border border-rc-border rounded p-4">
        <div className="text-xs font-mono text-rc-dim uppercase tracking-widest mb-3">Storage</div>
        <StorageBar used={stats.bytesUsed} total={device.storageBytesTotal} />
        <div className="mt-2 text-xs font-mono text-rc-muted">
          {tagged.length} ROMs tagged · {fmtSize(stats.bytesUsed)} used of {fmtSize(device.storageBytesTotal)}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard icon={CheckCircle} label="Synced" value={stats.synced} color="#3fb950" />
        <StatCard icon={Clock} label="Pending add" value={stats.pendingAdd} color="#e8a000" />
        <StatCard icon={Tag} label="Pending remove" value={stats.pendingRemove} color="#f0883e" />
        <StatCard icon={AlertTriangle} label="Conflicts" value={stats.conflict} color="#f85149" />
      </div>

      {/* Tagged games table */}
      <div className="bg-rc-surface border border-rc-border rounded overflow-hidden">
        <div className="px-4 py-3 border-b border-rc-border flex items-center justify-between">
          <span className="text-sm font-medium text-rc-text">Tagged games ({tagged.length})</span>
        </div>
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 bg-rc-surface">
              <tr className="border-b border-rc-border">
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-rc-dim">Title</th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-rc-dim">Console</th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-rc-dim">Size</th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-rc-dim">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {tagged.map(item => (
                <tr key={item.id} className="border-b border-rc-border/50 hover:bg-rc-surface2/60 transition-colors">
                  <td className="px-4 py-2 font-mono text-rc-text">{item.title}</td>
                  <td className="px-4 py-2"><ConsoleBadge console={item.console} /></td>
                  <td className="px-4 py-2 font-mono text-rc-muted">{fmtSize(item.sizeBytes)}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={item.deviceTags[device.id]!} />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => toggleDeviceTag(item.id, device.id)}
                      className="text-rc-dim hover:text-rc-red text-[10px] font-mono transition-colors"
                    >
                      untag
                    </button>
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
