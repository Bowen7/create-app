import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import adapter from '@hono/vite-dev-server/node'
import build from '@hono/vite-build/node'
import devServer from '@hono/vite-dev-server'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [react()],
      build: {
        rollupOptions: {
          input: './index.html',
          output: {
            dir: './dist/static',
          },
        },
        copyPublicDir: false,
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
    }
  }
  return ({
    plugins: [build({
      entry: ['./api/index.ts'],
    }), devServer({
      adapter,
      entry: 'api/index.ts',
    }), react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  })
})
