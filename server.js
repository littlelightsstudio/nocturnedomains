/**
 * helenaflinn.com — Express server.
 *
 * Liefert die statischen HTML/CSS/JS/Bild-Files. Trust-Proxy ist auf 1
 * gesetzt damit Coolify/Traefik richtige Client-IPs durchreichen kann.
 * Erweiterungspunkt für API-Routes: einfach app.use('/api', ...) ergänzen.
 */
import express from 'express'
import compression from 'compression'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 3000

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)

app.use(compression())

// Health-Check für Coolify
app.get('/health', (_req, res) => res.json({ ok: true }))

// Static serving aus dem Repo-Root.
//  - extensions: 'html' → /faq matcht /faq.html
//  - HTML-Files mit kurzer Cache-Time (10 Min) damit Updates schnell durchgreifen
//  - Andere Assets via ETag (Express-Default) revalidieren ohne harte TTL
app.use(
  express.static(__dirname, {
    extensions: ['html'],
    setHeaders(res, path) {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=600')
      }
    },
  }),
)

// 404-Fallback auf die existierende 404.html
app.use((_req, res) => {
  res.status(404).sendFile(join(__dirname, '404.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`helenaflinn.com listening on :${PORT}`)
})
