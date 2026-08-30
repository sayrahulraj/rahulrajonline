import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// weird edge case: something (browser extension? leftover service worker from
// another project on this port?) sometimes requests an .html file with
// Sec-Fetch-Dest: script, which makes vite choke trying to parse it as JS.
// this just no-ops those requests instead of letting them blow up the console.
function ignoreHtmlAsScriptRequests(): Plugin {
  return {
    name: 'ignore-html-as-script-requests',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0].endsWith('.html') && req.headers['sec-fetch-dest'] === 'script') {
          res.statusCode = 204
          res.end()
          return
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ignoreHtmlAsScriptRequests()],
  server: {
    // only matters if you're running `npm run dev` + `vercel dev` side by side
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
