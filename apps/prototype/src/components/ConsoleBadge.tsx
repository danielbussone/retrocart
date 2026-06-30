import type { ConsoleId } from '../types'

const CONSOLE_META: Record<ConsoleId, { label: string; color: string }> = {
  nes:     { label: 'NES',     color: 'var(--con-nes)' },
  snes:    { label: 'SNES',    color: 'var(--con-snes)' },
  gba:     { label: 'GBA',     color: 'var(--con-gba)' },
  gb:      { label: 'GB',      color: 'var(--con-gb)' },
  gbc:     { label: 'GBC',     color: 'var(--con-gbc)' },
  psx:     { label: 'PS1',     color: 'var(--con-psx)' },
  genesis: { label: 'GEN',     color: 'var(--con-gen)' },
  n64:     { label: 'N64',     color: 'var(--con-n64)' },
}

export function ConsoleBadge({ console: con }: { console: ConsoleId }) {
  const meta = CONSOLE_META[con]
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded border"
      style={{
        color: meta.color,
        borderColor: meta.color,
        backgroundColor: 'var(--badge-bg)',
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
