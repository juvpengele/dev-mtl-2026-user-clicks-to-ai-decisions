// Builds the deck and prints every slide (at its final step) to slides.pdf, one 1920×1080 page per slide.
// Usage: npm run pdf [-- out.pdf]     (CHROME=/path/to/chrome to pick the browser)
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { build, preview } from 'vite'
import { launch } from './chrome.mjs'

const out = resolve(process.argv[2] ?? 'slides.pdf')
await build({ logLevel: 'warn' })
const server = await preview({ preview: { port: 4719, strictPort: false }, logLevel: 'warn' })
const chrome = await launch()
try {
  await chrome.send('Emulation.setEmulatedMedia', { media: 'print', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await chrome.goto(server.resolvedUrls.local[0] + '?print')
  await new Promise((r) => setTimeout(r, 800)) // let images (feedback QR) settle
  const { data } = await chrome.send('Page.printToPDF', {
    paperWidth: 1920 / 96,
    paperHeight: 1080 / 96,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    printBackground: true,
    preferCSSPageSize: true,
  })
  writeFileSync(out, Buffer.from(data, 'base64'))
  const pages = await chrome.evaluate('document.querySelectorAll(".print-page").length')
  console.log(`Wrote ${out}: ${pages} slides`)
} finally {
  await chrome.close()
  await server.close()
}
