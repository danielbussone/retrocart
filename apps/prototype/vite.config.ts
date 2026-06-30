import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'
import { resolve } from 'path'

const _require = createRequire(import.meta.url)
const tailwindConfigPath = resolve(__dirname, 'tailwind.config.cjs')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'tailwind-config-hmr',
      configureServer(server) {
        server.watcher.on('change', (file) => {
          if (file.includes('tailwind.config')) {
            delete _require.cache[tailwindConfigPath]
            server.ws.send({ type: 'full-reload' })
          }
        })
      },
    },
  ],
})
