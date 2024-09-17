import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import adapter from '@hono/vite-dev-server/node'
import build from '@hono/vite-build/node'
import devServer from '@hono/vite-dev-server'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), build(), devServer({
    adapter,
    entry: 'api/index.tsx',
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
