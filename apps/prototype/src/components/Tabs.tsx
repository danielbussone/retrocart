import type { ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  badge?: number
  badgeVariant?: 'amber' | 'red' | 'green'
}

interface Props {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
  children: ReactNode
}

export function Tabs({ tabs, active, onChange, children }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-rc-border shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              active === tab.id
                ? 'border-rc-amber text-rc-amber'
                : 'border-transparent text-rc-muted hover:text-rc-text'
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full ${
                tab.badgeVariant === 'red' ? 'bg-rc-red/20 text-rc-red' :
                tab.badgeVariant === 'green' ? 'bg-rc-green/20 text-rc-green' :
                'bg-rc-amber/20 text-rc-amber'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}
