import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Some browser extensions / stray service workers (usually left behind by an
// unrelated project that previously ran on the same port) occasionally
// request an .html file with `Sec-Fetch-Dest: script`. Vite then hands that
// raw HTML to the JS transform pipeline, which crashes with a confusing
// "invalid JS syntax" overlay. Nothing in this app makes that kind of
// request, so it's always noise from outside the app — short-circuit it
// with an empty response instead of letting it reach import-analysis.
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
    // When running `vercel dev` alongside `npm run dev`, proxy API calls to it.
    // If you instead run everything through `vercel dev` directly, this is unused.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
