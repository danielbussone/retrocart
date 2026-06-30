import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        rc: {
          // SNES reference: housing gray #b2b4b2, mid gray #707372, dark charcoal #54585a
          bg: '#b2b4b2',
          surface: '#bcbebb',
          surface2: '#c8cac8',
          surface3: '#d4d6d4',
          border: '#707372',
          border2: '#54585a',
          // SNES reference: logo purple #514689, light periwinkle #a7a4e0
          amber: '#514689',
          'amber-bright': '#a7a4e0',
          'amber-dim': '#332d60',
          green: '#2e7d32',
          'green-dim': '#1b5e20',
          red: '#c62828',
          'red-dim': '#7f0000',
          orange: '#e65100',
          blue: '#1565c0',
          // dark purple-black text on neutral gray bg
          text: '#2a2448',
          muted: '#514689',
          dim: '#6e6c88',
        },
      },
      boxShadow: {
        amber: '0 0 14px rgba(81,70,137,0.4)',
        'amber-sm': '0 0 7px rgba(81,70,137,0.3)',
        'inset-amber': 'inset 0 0 0 1px rgba(81,70,137,0.45)',
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
} satisfies Config
