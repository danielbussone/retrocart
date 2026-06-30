import type { ConsoleId } from '../types'

const CONSOLE_META: Record<ConsoleId, { label: string; color: string }> = {
  nes:     { label: 'NES',     color: '#e85d4a' },
  snes:    { label: 'SNES',    color: '#7b5fe8' },
  gba:     { label: 'GBA',     color: '#9b59b6' },
  gb:      { label: 'GB',      color: '#aaaaaa' },
  gbc:     { label: 'GBC',     color: '#e8c53a' },
  psx:     { label: 'PS1',     color: '#4a8fe8' },
  genesis: { label: 'GEN',     color: '#e87a3a' },
  n64:     { label: 'N64',     color: '#3abfe8' },
}

export function ConsoleBadge({ console: con }: { console: ConsoleId }) {
  const meta = CONSOLE_META[con]
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded border"
      style={{
        color: meta.color,
        borderColor: `${meta.color}50`,
        backgroundColor: `${meta.color}18`,
      }}
    >
      {meta.label}
    </span>
  )
}

export function CONSOLES(): ConsoleId[] {
  return ['nes', 'snes', 'gba', 'gb', 'gbc', 'psx', 'genesis', 'n64']
}

export { CONSOLE_META }
