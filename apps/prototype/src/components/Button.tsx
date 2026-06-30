import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const VARIANT: Record<Variant, string> = {
  primary: 'bg-rc-amber text-rc-bg font-semibold hover:bg-rc-amber-bright shadow-amber-sm hover:shadow-amber active:scale-95',
  secondary: 'bg-rc-surface2 text-rc-text border border-rc-border2 hover:border-rc-amber/50 hover:text-rc-amber active:scale-95',
  ghost: 'text-rc-muted hover:text-rc-text hover:bg-rc-surface2 active:scale-95',
  danger: 'bg-rc-red/10 text-rc-red border border-rc-red/30 hover:bg-rc-red/20 active:scale-95',
}

const SIZE: Record<Size, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3.5 py-1.5 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({ variant = 'secondary', size = 'md', className = '', children, ...rest }: Props) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded transition-all duration-100 font-medium ${VARIANT[variant]} ${SIZE[size]} disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
