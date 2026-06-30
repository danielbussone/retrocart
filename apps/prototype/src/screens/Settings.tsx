import { useState } from 'react'
import { FolderOpen, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Button } from '../components/Button'

const PLATFORM_MAP = [
  { label: 'NES',          esde: 'nes',     onion: 'FC',   core: 'FCEUmm' },
  { label: 'SNES',         esde: 'snes',    onion: 'SFC',  core: 'Snes9x' },
  { label: 'Game Boy',     esde: 'gb',      onion: 'GB',   core: 'Gambatte' },
  { label: 'GBC',          esde: 'gbc',     onion: 'GBC',  core: 'Gambatte' },
  { label: 'GBA',          esde: 'gba',     onion: 'GBA',  core: 'mGBA' },
  { label: 'Genesis',      esde: 'genesis', onion: 'MD',   core: 'Genesis Plus GX' },
  { label: 'PS1',          esde: 'psx',     onion: 'PS',   core: 'PCSX-ReARMed' },
  { label: 'N64',          esde: 'n64',     onion: 'N64',  core: 'Mupen64Plus-Next' },
]

export function Settings() {
  const { libraryRoots, addLibraryRoot, removeLibraryRoot } = useApp()
  const [newRoot, setNewRoot] = useState('')

  function addRoot() {
    const v = newRoot.trim()
    if (v) { addLibraryRoot(v); setNewRoot('') }
  }

  return (
    <div className="p-6 max-w-3xl space-y-8">
      <h1 className="text-lg font-semibold text-rc-text">Settings</h1>

      {/* Library roots */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-rc-text">Library Roots</h2>
          <p className="text-xs text-rc-muted mt-0.5">Folders RetroCart watches for ROM files.</p>
        </div>
        <div className="bg-rc-surface border border-rc-border rounded-lg overflow-hidden">
          {libraryRoots.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-rc-dim font-mono">No library roots configured.</div>
          ) : (
            libraryRoots.map(root => (
              <div key={root} className="flex items-center gap-3 px-4 py-2.5 border-b border-rc-border last:border-0">
                <FolderOpen size={13} className="text-rc-muted shrink-0" />
                <span className="flex-1 text-xs font-mono text-rc-text">{root}</span>
                <button onClick={() => removeLibraryRoot(root)} className="text-rc-dim hover:text-rc-red transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
          <div className="flex gap-2 p-3 border-t border-rc-border">
            <input
              value={newRoot}
              onChange={e => setNewRoot(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addRoot()}
              placeholder="D:\ROMs"
              className="flex-1 bg-rc-surface2 border border-rc-border2 rounded px-3 py-1.5 text-xs font-mono text-rc-text placeholder:text-rc-dim focus:outline-none focus:border-rc-amber"
            />
            <Button size="sm" variant="secondary" onClick={addRoot}><Plus size={12} /> Add</Button>
          </div>
        </div>
      </section>

      {/* Conflict policy */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-rc-text">Save Conflict Policy</h2>
          <p className="text-xs text-rc-muted mt-0.5">How to resolve save file conflicts between vault and device.</p>
        </div>
        <div className="bg-rc-surface border border-rc-border rounded-lg p-4 space-y-2">
          {[
            { id: 'newer-wins', label: 'Newer file wins', desc: 'Compares mtime, then hash. Older copy is renamed with timestamp. (Default)' },
          ].map(opt => (
            <label key={opt.id} className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="conflict" defaultChecked className="mt-0.5 accent-rc-amber" />
              <div>
                <div className="text-sm text-rc-text font-medium">{opt.label}</div>
                <div className="text-xs text-rc-muted mt-0.5">{opt.desc}</div>
              </div>
            </label>
          ))}
          <div className="pt-2 text-xs text-rc-dim font-mono border-t border-rc-border">
            Renamed conflict files: <span className="text-rc-orange">{'<basename>.retrocart-conflict-<iso8601><ext>'}</span>
          </div>
        </div>
      </section>

      {/* Platform map */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-rc-text">Platform Map</h2>
          <p className="text-xs text-rc-muted mt-0.5">Console → adapter folder and core mapping. Read-only in v0.</p>
        </div>
        <div className="bg-rc-surface border border-rc-border rounded-lg overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-rc-border">
                {['Console', 'ES-DE folder', 'OnionOS folder', 'Save core'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-rc-dim">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLATFORM_MAP.map(row => (
                <tr key={row.label} className="border-b border-rc-border/50 hover:bg-rc-surface2/60 last:border-0">
                  <td className="px-4 py-2.5 font-semibold text-rc-text">{row.label}</td>
                  <td className="px-4 py-2.5 font-mono text-rc-muted">{row.esde}</td>
                  <td className="px-4 py-2.5 font-mono text-rc-muted">{row.onion}</td>
                  <td className="px-4 py-2.5 font-mono text-rc-muted">{row.core}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-rc-dim font-mono">Per-device overrides available in Phase 1.</p>
      </section>

      {/* App info */}
      <section className="pt-2 border-t border-rc-border text-[10px] font-mono text-rc-dim space-y-0.5">
        <div>RetroCart Prototype v0 · Phase 0 — browser-only, mock data</div>
        <div>Real file I/O, SQLite, and Tauri integration in Phase 1.</div>
      </section>
    </div>
  )
}
