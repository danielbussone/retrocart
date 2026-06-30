import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, HardDrive, CheckCircle, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react'
import { useApp, useDeviceStats, MOCK_SYNC_PLAN } from '../store/AppContext'
import { FrontendBadge } from '../components/Badge'
import { Button } from '../components/Button'

const MOCK_DRIVES = ['C:\\', 'D:\\', 'E:\\', 'F:\\']

export function SyncHub() {
  const { devices, activeSyncDeviceId, setActiveSyncDeviceId, setSyncPlan } = useApp()
  const navigate = useNavigate()
  const [selectedDrive, setSelectedDrive] = useState('E:\\')
  const [detecting, setDetecting] = useState(false)

  const activeDevice = devices.find(d => d.id === activeSyncDeviceId) ?? null

  function detectDevice() {
    setDetecting(true)
    setTimeout(() => {
      const matched = devices.find(d => d.mockMountPath === selectedDrive)
      if (matched) setActiveSyncDeviceId(matched.id)
      else setActiveSyncDeviceId(null)
      setDetecting(false)
    }, 900)
  }

  function openDiff() {
    setSyncPlan(MOCK_SYNC_PLAN)
    navigate('/sync/diff')
  }

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-rc-text">Sync</h1>
        <p className="text-sm text-rc-muted mt-1">Insert an SD card and sync your tagged library to a device.</p>
      </div>

      {/* Drive picker */}
      <div className="bg-rc-surface border border-rc-border rounded-lg p-5 space-y-4">
        <div className="text-xs font-mono text-rc-dim uppercase tracking-widest">SD Card / Drive</div>
        <div className="flex items-center gap-3">
          <HardDrive size={16} className="text-rc-muted" />
          <select
            value={selectedDrive}
            onChange={e => { setSelectedDrive(e.target.value); setActiveSyncDeviceId(null) }}
            className="bg-rc-surface2 border border-rc-border2 rounded px-3 py-1.5 text-sm font-mono text-rc-text focus:outline-none focus:border-rc-amber"
          >
            {MOCK_DRIVES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <Button variant="secondary" onClick={detectDevice} disabled={detecting}>
            {detecting ? <RefreshCw size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            {detecting ? 'Detecting...' : 'Detect device'}
          </Button>
          <span className="text-xs text-rc-dim font-mono">or select device manually ↓</span>
        </div>

        {/* Manual device selection */}
        <div className="flex gap-2">
          {devices.map(d => (
            <button
              key={d.id}
              onClick={() => setActiveSyncDeviceId(d.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded border text-sm transition-all ${
                activeSyncDeviceId === d.id
                  ? 'border-rc-amber/60 bg-rc-amber/10 text-rc-amber'
                  : 'border-rc-border text-rc-muted hover:border-rc-border2 hover:text-rc-text'
              }`}
            >
              {d.name} <FrontendBadge type={d.frontendType} />
            </button>
          ))}
        </div>
      </div>

      {/* Detected device banner */}
      {activeDevice && (
        <DeviceSyncPreview
          device={activeDevice}
          mountPath={selectedDrive}
          onOpenDiff={openDiff}
        />
      )}

      {/* No device yet */}
      {!activeDevice && !detecting && (
        <div className="border border-rc-border rounded-lg p-8 text-center text-rc-muted text-sm">
          <HardDrive size={24} className="mx-auto mb-3 text-rc-dim" />
          <div>No device selected. Insert an SD card or pick a device above.</div>
        </div>
      )}
    </div>
  )
}

function DeviceSyncPreview({ device, mountPath, onOpenDiff }: {
  device: NonNullable<ReturnType<typeof useApp>['devices'][number]>
  mountPath: string
  onOpenDiff: () => void
}) {
  const stats = useDeviceStats(device.id)
  const plan = MOCK_SYNC_PLAN
  const addCount = plan.romOps.filter(o => o.action === 'add').length
  const removeCount = plan.romOps.filter(o => o.action === 'remove').length
  const saveCount = plan.saveOps.length
  const conflictCount = plan.saveOps.filter(o => o.isConflict).length

  const hasPending = stats.pendingAdd > 0 || stats.pendingRemove > 0 || stats.conflict > 0

  return (
    <div className="bg-rc-surface border border-rc-amber/30 rounded-lg overflow-hidden">
      {/* Device banner */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-rc-border bg-rc-amber/5">
        <CheckCircle size={15} className="text-rc-amber" />
        <div>
          <span className="text-sm font-semibold text-rc-amber">{device.name}</span>
          <span className="text-xs text-rc-muted ml-2">detected at {mountPath}</span>
        </div>
        <FrontendBadge type={device.frontendType} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 divide-x divide-rc-border p-0">
        {[
          { icon: ArrowUp, label: 'ROMs to add', value: addCount, color: '#3fb950' },
          { icon: ArrowDown, label: 'ROMs to remove', value: removeCount, color: '#f0883e' },
          { icon: RefreshCw, label: 'Save ops', value: saveCount, color: '#58a6ff' },
          { icon: AlertTriangle, label: 'Conflicts', value: conflictCount, color: '#f85149' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-3 px-5 py-4">
            <Icon size={16} style={{ color }} />
            <div>
              <div className="text-xl font-mono font-semibold text-rc-text">{value}</div>
              <div className="text-[10px] text-rc-muted">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t border-rc-border flex items-center gap-3">
        {conflictCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-rc-red font-mono">
            <AlertTriangle size={12} /> {conflictCount} save conflicts — review before applying
          </div>
        )}
        <div className="flex-1" />
        <Button variant="secondary" onClick={onOpenDiff} disabled={!hasPending && saveCount === 0}>
          Preview diff
        </Button>
        <Button variant="primary" onClick={onOpenDiff} disabled={!hasPending && saveCount === 0}>
          <RefreshCw size={13} /> Sync now
        </Button>
      </div>
    </div>
  )
}
