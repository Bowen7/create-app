import { readFile } from 'node:fs/promises'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono()

class HtmlHandler {
  static html = ''
  static async fetch() {
    if (this.html === '') {
      if (import.meta.env.PROD) {
        this.html = await readFile('dist/static/index.html', 'utf8')
      } else {
        const html = await readFile('index.html', 'utf8')
        HtmlHandler.html = html.replace('<head>', `
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
    }
    return HtmlHandler.html
  }
}

if (import.meta.env.PROD) {
  app.use('/assets/*', serveStatic({ root: '/dist/static/' }))
}

app.get('/', async (c) => {
  const html = await HtmlHandler.fetch()
  return c.html(html)
})

export default app

if (import.meta.env.PROD) {
  serve({ ...app, port: 4000 }, (info) => {
    // eslint-disable-next-line no-console
    console.log(`Listening on http://localhost:${info.port}`)
  })
}
