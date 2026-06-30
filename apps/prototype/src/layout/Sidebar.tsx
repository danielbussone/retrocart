import { NavLink, useNavigate } from 'react-router-dom'
import { Library, Monitor, Layers, RefreshCw, Settings, Gamepad2, Sun, Moon } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { FrontendBadge } from '../components/Badge'

const NAV = [
  { to: '/library',     icon: Library,    label: 'Library' },
  { to: '/collections', icon: Layers,     label: 'Collections' },
  { to: '/sync',        icon: RefreshCw,  label: 'Sync' },
  { to: '/settings',    icon: Settings,   label: 'Settings' },
]

export function Sidebar() {
  const { devices, theme, toggleTheme } = useApp()
  const navigate = useNavigate()

  return (
    <aside className="flex flex-col w-52 shrink-0 bg-rc-surface border-r border-rc-border h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-rc-border">
        <div className="flex items-center gap-2">
          <Gamepad2 size={18} className="text-rc-amber" />
          <span className="font-mono font-semibold text-rc-amber tracking-wide text-sm">RetroCart</span>
        </div>
        <div className="mt-0.5 text-[10px] font-mono text-rc-dim">PROTOTYPE v0</div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-rc-amber/10 text-rc-amber border border-rc-amber/20'
                  : 'text-rc-muted hover:text-rc-text hover:bg-rc-surface2'
              }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}

        {/* Devices sub-section */}
        <div className="pt-4 pb-1 px-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-rc-dim uppercase tracking-widest">
            <Monitor size={10} />
            Devices
          </div>
        </div>
        {devices.map(d => (
          <button
            key={d.id}
            onClick={() => navigate(`/devices/${d.id}`)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-rc-muted hover:text-rc-text hover:bg-rc-surface2 transition-colors"
          >
            <span className="text-xs font-mono truncate flex-1 text-left">{d.name}</span>
            <FrontendBadge type={d.frontendType} />
          </button>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="px-3 py-3 border-t border-rc-border/40">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-rc-dim hover:text-rc-text hover:bg-rc-surface2 transition-colors"
        >
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          <span className="font-mono text-xs">{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
        </button>
      </div>
    </aside>
  )
}
