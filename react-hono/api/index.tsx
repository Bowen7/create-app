import process from 'node:process'
import { readFile } from 'node:fs/promises'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'

const isProd = process.env.NODE_ENV === 'production'
let html = await readFile(isProd ? 'build/index.html' : 'index.html', 'utf8')

if (!isProd) {
  // Inject Vite client code to the HTML
  html = html.replace('<head>', `
  <script type="module">
import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
</script>

  <script type="module" src="/@vite/client"></script>
  `)
}

const app = new Hono()

app.use('/assets/*', serveStatic({ root: isProd ? 'build/' : './' }))

const api = app.basePath('/api')

api.get('', (c) => {
  return c.json({ message: 'Hello, Cloudflare Pages!' })
})

app.get('/*', c => c.html(html))

export default app

if (isProd) {
  serve({ ...app, port: 3000 }, (info) => {
    // eslint-disable-next-line no-console
    console.log(`Listening on http://localhost:${info.port}`)
  })
}
