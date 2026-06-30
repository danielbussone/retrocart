function fmtBytes(b: number): string {
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`
  if (b >= 1e6) return `${(b / 1e6).toFixed(1)} MB`
  return `${(b / 1e3).toFixed(0)} KB`
}

interface Props {
  used: number
  total: number
}

export function StorageBar({ used, total }: Props) {
  const pct = Math.min((used / total) * 100, 100)
  const color = pct > 90 ? 'bg-rc-red' : pct > 75 ? 'bg-rc-orange' : 'bg-rc-amber'

  return (
    <div className="space-y-1.5">
      <div className="h-2 w-full rounded-full bg-rc-surface3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-mono text-rc-muted">
        <span>{fmtBytes(used)} used</span>
        <span>{fmtBytes(total - used)} free / {fmtBytes(total)}</span>
      </div>
    </div>
  )
}
