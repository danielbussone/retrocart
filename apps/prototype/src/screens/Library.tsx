import { useState } from 'react'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Filter } from 'lucide-react'
import { useApp, useFilteredLibrary } from '../store/AppContext'
import { ConsoleBadge, CONSOLES } from '../components/ConsoleBadge'
import { StatusBadge } from '../components/Badge'
import { Button } from '../components/Button'
import type { LibrarySortKey, SyncStatus } from '../types'

function fmtSize(b: number): string {
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)}G`
  if (b >= 1e6) return `${(b / 1e6).toFixed(0)}M`
  return `${(b / 1e3).toFixed(0)}K`
}

function Stars({ rating }: { rating: number }) {
  const n = Math.round(rating * 5)
  return (
    <span className="font-mono text-[10px] text-rc-muted">
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )
}

function SortIcon({ col, active, dir }: { col: string; active: string; dir: 'asc' | 'desc' }) {
  if (col !== active) return <ChevronsUpDown size={11} className="text-rc-dim" />
  return dir === 'asc' ? <ChevronUp size={11} className="text-rc-amber" /> : <ChevronDown size={11} className="text-rc-amber" />
}

const SORT_COLS: { key: LibrarySortKey; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'console', label: 'Console' },
  { key: 'size', label: 'Size' },
  { key: 'year', label: 'Year' },
  { key: 'rating', label: 'Rating' },
]

export function Library() {
  const { devices, filter, sortKey, sortDir, setFilter, setSort, toggleDeviceTag, setTagBulk } = useApp()
  const items = useFilteredLibrary()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  function toggleSort(key: LibrarySortKey) {
    if (sortKey === key) setSort(key, sortDir === 'asc' ? 'desc' : 'asc')
    else setSort(key, 'asc')
  }

  function toggleSelect(id: string) {
    setSelected(s => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  function selectAll() {
    if (selected.size === items.length) setSelected(new Set())
    else setSelected(new Set(items.map(i => i.id)))
  }

  function bulkTag(deviceId: string, status: SyncStatus | null) {
    setTagBulk([...selected], deviceId, status)
    setSelected(new Set())
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3 border-b border-rc-border flex items-center gap-3 shrink-0">
        <h1 className="text-sm font-semibold text-rc-text">Library</h1>
        <span className="text-xs text-rc-dim font-mono">{items.length} / {useFilteredLibrary.length} items</span>
        <div className="flex-1" />
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-rc-dim" />
          <input
            type="text"
            value={filter.search}
            onChange={e => setFilter({ search: e.target.value })}
            placeholder="Search title, dev, genre..."
            className="w-64 bg-rc-surface2 border border-rc-border2 rounded pl-8 pr-3 py-1.5 text-xs font-mono text-rc-text placeholder:text-rc-dim focus:outline-none focus:border-rc-amber"
          />
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowFilters(v => !v)}>
          <Filter size={13} /> Filters
        </Button>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="px-5 py-2.5 border-b border-rc-border bg-rc-surface flex items-center gap-4 flex-wrap text-xs shrink-0">
          {/* Console filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-rc-dim font-mono">Console:</span>
            <select
              value={filter.console}
              onChange={e => setFilter({ console: e.target.value as any })}
              className="bg-rc-surface2 border border-rc-border2 rounded px-2 py-1 text-xs font-mono text-rc-text focus:outline-none focus:border-rc-amber"
            >
              <option value="all">All</option>
              {CONSOLES().map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
          </div>
          {/* Device filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-rc-dim font-mono">Device:</span>
            <select
              value={filter.deviceId}
              onChange={e => setFilter({ deviceId: e.target.value })}
              className="bg-rc-surface2 border border-rc-border2 rounded px-2 py-1 text-xs font-mono text-rc-text focus:outline-none focus:border-rc-amber"
            >
              <option value="all">All</option>
              {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-rc-dim font-mono">Status:</span>
            <select
              value={filter.syncStatus}
              onChange={e => setFilter({ syncStatus: e.target.value as any })}
              className="bg-rc-surface2 border border-rc-border2 rounded px-2 py-1 text-xs font-mono text-rc-text focus:outline-none focus:border-rc-amber"
            >
              <option value="all">All</option>
              <option value="synced">Synced</option>
              <option value="pending_add">Pending add</option>
              <option value="pending_remove">Pending remove</option>
              <option value="conflict">Conflict</option>
              <option value="untagged">Untagged</option>
            </select>
          </div>
          <button onClick={() => setFilter({ search: '', console: 'all', syncStatus: 'all', deviceId: 'all' })}
            className="text-rc-dim hover:text-rc-red text-xs">✕ clear</button>
        </div>
      )}

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="px-5 py-2 border-b border-rc-amber/20 bg-rc-amber/5 flex items-center gap-3 text-xs shrink-0">
          <span className="font-mono text-rc-amber">{selected.size} selected</span>
          <div className="flex gap-2">
            {devices.map(d => (
              <div key={d.id} className="flex items-center gap-1">
                <span className="text-rc-dim">{d.name}:</span>
                <Button size="sm" variant="secondary" onClick={() => bulkTag(d.id, 'pending_add')}>Tag</Button>
                <Button size="sm" variant="ghost" onClick={() => bulkTag(d.id, null)}>Untag</Button>
              </div>
            ))}
          </div>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-rc-dim hover:text-rc-text">✕</button>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs border-collapse min-w-[900px]">
          <thead className="sticky top-0 bg-rc-surface z-10">
            <tr className="border-b border-rc-border">
              <th className="w-8 px-3 py-2.5 text-left">
                <input
                  type="checkbox"
                  checked={selected.size === items.length && items.length > 0}
                  onChange={selectAll}
                  className="accent-rc-amber"
                />
              </th>
              {SORT_COLS.map(({ key, label }) => (
                <th key={key} className="px-3 py-2.5 text-left">
                  <button
                    className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-rc-dim hover:text-rc-text transition-colors"
                    onClick={() => toggleSort(key)}
                  >
                    {label} <SortIcon col={key} active={sortKey} dir={sortDir} />
                  </button>
                </th>
              ))}
              <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-rc-dim">Genre</th>
              {devices.map(d => (
                <th key={d.id} className="px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-widest text-rc-dim whitespace-nowrap">
                  {d.name.split(' ').slice(-1)[0]}
                </th>
              ))}
              <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-rc-dim">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, rowIdx) => {
              const isSelected = selected.has(item.id)
              const worstStatus = Object.values(item.deviceTags).includes('conflict') ? 'conflict'
                : Object.values(item.deviceTags).includes('pending_remove') ? 'pending_remove'
                : Object.values(item.deviceTags).includes('pending_add') ? 'pending_add'
                : Object.values(item.deviceTags).length > 0 ? 'synced' : null
              return (
                <tr
                  key={item.id}
                  className={`border-b border-rc-border/50 hover:bg-rc-surface2/60 transition-colors ${
                    isSelected ? 'bg-rc-amber/5' : rowIdx % 2 === 0 ? '' : 'bg-rc-surface/40'
                  }`}
                >
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item.id)}
                      className="accent-rc-amber"
                    />
                  </td>
                  <td className="px-3 py-2 font-mono text-rc-text max-w-[220px] truncate">{item.title}</td>
                  <td className="px-3 py-2"><ConsoleBadge console={item.console} /></td>
                  <td className="px-3 py-2 font-mono text-rc-muted">{fmtSize(item.sizeBytes)}</td>
                  <td className="px-3 py-2 font-mono text-rc-muted">{item.year}</td>
                  <td className="px-3 py-2"><Stars rating={item.rating} /></td>
                  <td className="px-3 py-2 text-rc-muted max-w-[120px] truncate">{item.genre}</td>
                  {devices.map(d => {
                    const tag = item.deviceTags[d.id]
                    return (
                      <td key={d.id} className="px-3 py-2 text-center">
                        <button
                          title={tag ? `${d.name}: ${tag} — click to toggle` : `Add to ${d.name}`}
                          onClick={() => toggleDeviceTag(item.id, d.id)}
                          className={`w-6 h-6 rounded border text-[10px] font-mono transition-all ${
                            tag === 'synced'         ? 'bg-rc-green/20 border-rc-green/65 text-rc-green hover:bg-rc-green/35' :
                            tag === 'pending_add'    ? 'bg-rc-amber/20 border-rc-amber/65 text-rc-amber hover:bg-rc-amber/35 animate-pulse-slow' :
                            tag === 'pending_remove' ? 'bg-rc-orange/20 border-rc-orange/65 text-rc-orange hover:bg-rc-orange/35' :
                            tag === 'conflict'       ? 'bg-rc-red/20 border-rc-red/65 text-rc-red hover:bg-rc-red/35' :
                            'border-rc-border text-rc-dim hover:border-rc-amber/40 hover:text-rc-amber'
                          }`}
                        >
                          {tag === 'synced' ? '✓' : tag === 'pending_add' ? '+' : tag === 'pending_remove' ? '−' : tag === 'conflict' ? '!' : '·'}
                        </button>
                      </td>
                    )
                  })}
                  <td className="px-3 py-2">
                    {worstStatus ? <StatusBadge status={worstStatus} /> : (
                      <span className="text-[10px] font-mono text-rc-dim">untagged</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="py-16 text-center text-rc-muted text-sm">No items match the current filters.</div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-2 border-t border-rc-border flex items-center gap-4 text-[10px] font-mono text-rc-dim shrink-0">
        <span>{items.length} items shown</span>
        <span>·</span>
        <span className="text-rc-green">{items.filter(i => Object.values(i.deviceTags).includes('synced')).length} synced</span>
        <span>·</span>
        <span className="text-rc-amber">{items.filter(i => Object.values(i.deviceTags).includes('pending_add')).length} pending add</span>
        <span>·</span>
        <span className="text-rc-red">{items.filter(i => Object.values(i.deviceTags).includes('conflict')).length} conflicts</span>
      </div>
    </div>
  )
}
