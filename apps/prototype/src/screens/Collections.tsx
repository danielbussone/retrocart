import { useState } from 'react'
import { Plus, Trash2, Edit2, Check } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Button } from '../components/Button'
import { Chip } from '../components/Badge'
import { ConsoleBadge } from '../components/ConsoleBadge'
import type { Collection } from '../types'

const PALETTE = ['#514689', '#1565c0', '#2e7d32', '#c62828', '#a7a4e0', '#e65100']

function EditModal({ col, onSave, onCancel }: { col: Collection; onSave: (c: Collection) => void; onCancel: () => void }) {
  const { library, devices } = useApp()
  const [draft, setDraft] = useState(col)
  const [search, setSearch] = useState('')

  const filtered = library.filter(i =>
    !draft.itemIds.includes(i.id) &&
    (search === '' || i.title.toLowerCase().includes(search.toLowerCase()))
  ).slice(0, 50)

  const inCollection = library.filter(i => draft.itemIds.includes(i.id))

  function toggleItem(id: string) {
    setDraft(d => ({
      ...d,
      itemIds: d.itemIds.includes(id) ? d.itemIds.filter(x => x !== id) : [...d.itemIds, id]
    }))
  }

  function toggleDevice(deviceId: string) {
    setDraft(d => ({
      ...d,
      deviceIds: d.deviceIds.includes(deviceId)
        ? d.deviceIds.filter(x => x !== deviceId)
        : [...d.deviceIds, deviceId]
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative z-10 w-[900px] max-h-[85vh] bg-rc-surface border border-rc-border2 rounded-lg flex flex-col shadow-xl">
        <div className="px-5 py-3 border-b border-rc-border flex items-center justify-between shrink-0">
          <h2 className="text-sm font-semibold text-rc-text">Edit Collection</h2>
          <button onClick={onCancel} className="text-rc-muted hover:text-rc-text">✕</button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left: settings + available */}
          <div className="w-1/2 border-r border-rc-border flex flex-col overflow-hidden">
            <div className="p-4 space-y-3 border-b border-rc-border shrink-0">
              <div>
                <label className="text-[10px] font-mono text-rc-dim uppercase tracking-widest">Name</label>
                <input
                  value={draft.name}
                  onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                  className="mt-1 w-full bg-rc-surface2 border border-rc-border2 rounded px-3 py-1.5 text-sm text-rc-text focus:outline-none focus:border-rc-amber"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-rc-dim uppercase tracking-widest">Color</label>
                <div className="flex gap-2 mt-1">
                  {PALETTE.map(c => (
                    <button
                      key={c}
                      onClick={() => setDraft(d => ({ ...d, color: c }))}
                      className="w-6 h-6 rounded-full border-2 transition-all"
                      style={{ backgroundColor: c, borderColor: draft.color === c ? 'white' : 'transparent' }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-rc-dim uppercase tracking-widest">Assign to devices</label>
                <div className="flex gap-2 mt-1">
                  {devices.map(d => (
                    <button
                      key={d.id}
                      onClick={() => toggleDevice(d.id)}
                      className={`px-2 py-1 text-xs rounded border transition-colors ${
                        draft.deviceIds.includes(d.id)
                          ? 'border-rc-amber/50 text-rc-amber bg-rc-amber/10'
                          : 'border-rc-border text-rc-muted hover:border-rc-border2'
                      }`}
                    >
                      {draft.deviceIds.includes(d.id) && <Check size={10} className="inline mr-1" />}
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 shrink-0">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search to add games..."
                className="w-full bg-rc-surface2 border border-rc-border2 rounded px-3 py-1.5 text-xs font-mono text-rc-text placeholder:text-rc-dim focus:outline-none focus:border-rc-amber"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs hover:bg-rc-surface2 transition-colors border-b border-rc-border/40 text-left"
                >
                  <Plus size={11} className="text-rc-dim shrink-0" />
                  <ConsoleBadge console={item.console} />
                  <span className="text-rc-text truncate">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: in collection */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            <div className="px-4 py-2.5 border-b border-rc-border text-[10px] font-mono text-rc-dim uppercase tracking-widest shrink-0">
              In collection ({inCollection.length})
            </div>
            <div className="flex-1 overflow-y-auto">
              {inCollection.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-2 border-b border-rc-border/40 hover:bg-rc-surface2 transition-colors"
                >
                  <ConsoleBadge console={item.console} />
                  <span className="text-xs text-rc-text flex-1 truncate">{item.title}</span>
                  <button onClick={() => toggleItem(item.id)} className="text-rc-dim hover:text-rc-red text-[10px]">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-rc-border flex justify-end gap-2 shrink-0">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={() => onSave(draft)}>Save Collection</Button>
        </div>
      </div>
    </div>
  )
}

export function Collections() {
  const { collections, devices, library, updateCollection, addCollection, deleteCollection } = useApp()
  const [editing, setEditing] = useState<Collection | null>(null)
  const [selected, setSelected] = useState<string | null>(collections[0]?.id ?? null)

  const active = collections.find(c => c.id === selected) ?? null
  const activeItems = active ? library.filter(i => active.itemIds.includes(i.id)) : []

  function newCollection() {
    const col: Collection = {
      id: `col-${Date.now()}`,
      name: 'New Collection',
      itemIds: [],
      deviceIds: [],
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    }
    addCollection(col)
    setEditing(col)
  }

  function saveEdit(col: Collection) {
    updateCollection(col)
    setEditing(null)
    setSelected(col.id)
  }

  return (
    <div className="flex h-full">
      {/* Left: collection list */}
      <div className="w-60 shrink-0 border-r border-rc-border flex flex-col">
        <div className="px-4 py-3 border-b border-rc-border flex items-center justify-between">
          <span className="text-sm font-semibold text-rc-text">Collections</span>
          <Button size="sm" variant="ghost" onClick={newCollection}><Plus size={13} /></Button>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {collections.map(col => (
            <button
              key={col.id}
              onClick={() => setSelected(col.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                selected === col.id ? 'bg-rc-surface2 text-rc-text' : 'text-rc-muted hover:bg-rc-surface2/60 hover:text-rc-text'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
              <span className="truncate flex-1">{col.name}</span>
              <span className="text-[10px] font-mono text-rc-dim">{col.itemIds.length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right: detail */}
      {active ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-3 border-b border-rc-border flex items-center gap-3 shrink-0">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: active.color }} />
            <h1 className="text-sm font-semibold text-rc-text">{active.name}</h1>
            <span className="text-xs text-rc-dim font-mono">{active.itemIds.length} games</span>
            <div className="flex gap-1.5">
              {active.deviceIds.map(id => {
                const d = devices.find(x => x.id === id)
                return d ? <Chip key={id} label={d.name} color={active.color} /> : null
              })}
            </div>
            <div className="flex-1" />
            <Button size="sm" variant="secondary" onClick={() => setEditing(active)}><Edit2 size={12} /> Edit</Button>
            <Button size="sm" variant="danger" onClick={() => { deleteCollection(active.id); setSelected(collections.find(c => c.id !== active.id)?.id ?? null) }}>
              <Trash2 size={12} />
            </Button>
          </div>

          {/* Assigned devices */}
          {active.deviceIds.length > 0 && (
            <div className="px-5 py-2.5 border-b border-rc-border bg-rc-surface flex items-center gap-3 text-xs shrink-0">
              <span className="text-rc-dim font-mono">Synced to:</span>
              {active.deviceIds.map(id => {
                const d = devices.find(x => x.id === id)
                return d ? <Chip key={id} label={d.name} color={active.color} /> : null
              })}
            </div>
          )}

          {/* Game list */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-rc-surface">
                <tr className="border-b border-rc-border">
                  <th className="px-5 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-rc-dim">Title</th>
                  <th className="px-5 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-rc-dim">Console</th>
                  <th className="px-5 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-rc-dim">Genre</th>
                  <th className="px-5 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-rc-dim">Year</th>
                </tr>
              </thead>
              <tbody>
                {activeItems.map(item => (
                  <tr key={item.id} className="border-b border-rc-border/50 hover:bg-rc-surface2/60 transition-colors">
                    <td className="px-5 py-2 font-mono text-rc-text">{item.title}</td>
                    <td className="px-5 py-2"><ConsoleBadge console={item.console} /></td>
                    <td className="px-5 py-2 text-rc-muted">{item.genre}</td>
                    <td className="px-5 py-2 font-mono text-rc-muted">{item.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-rc-muted text-sm">
          Select a collection or create one.
        </div>
      )}

      {editing && (
        <EditModal col={editing} onSave={saveEdit} onCancel={() => setEditing(null)} />
      )}
    </div>
  )
}
