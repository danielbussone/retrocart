/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        rc: {
          // solid colors (no opacity modifier needed)
          bg: 'var(--rc-bg)',
          surface: 'var(--rc-surface)',
          surface2: 'var(--rc-surface2)',
          surface3: 'var(--rc-surface3)',
          'amber-bright': 'var(--rc-amber-bright)',
          'amber-dim': 'var(--rc-amber-dim)',
          'green-dim': 'var(--rc-green-dim)',
          'red-dim': 'var(--rc-red-dim)',
          text: 'var(--rc-text)',
          muted: 'var(--rc-muted)',
          dim: 'var(--rc-dim)',
          // RGB channel vars — support bg-rc-amber/20, border-rc-green/60, etc.
          border: 'rgb(var(--rc-border) / <alpha-value>)',
          border2: 'rgb(var(--rc-border2) / <alpha-value>)',
          amber: 'rgb(var(--rc-amber) / <alpha-value>)',
          green: 'rgb(var(--rc-green) / <alpha-value>)',
          red: 'rgb(var(--rc-red) / <alpha-value>)',
          orange: 'rgb(var(--rc-orange) / <alpha-value>)',
          blue: 'rgb(var(--rc-blue) / <alpha-value>)',
        },
      },
      boxShadow: {
        amber: 'var(--shadow-amber)',
        'amber-sm': 'var(--shadow-amber-sm)',
        'inset-amber': 'var(--shadow-inset-amber)',
      },
      animation: {
        blink: 'blink 1.2s step-end infinite',
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
