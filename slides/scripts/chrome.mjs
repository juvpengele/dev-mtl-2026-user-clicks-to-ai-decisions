// Minimal headless-Chrome driver over the DevTools protocol (Node 22+: global fetch + WebSocket).
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CANDIDATES = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

export async function launch() {
  const bin = CANDIDATES.find((p) => existsSync(p))
  if (!bin) throw new Error('No Chrome/Chromium found. Set CHROME=/path/to/chrome, or open ?print in a browser and Save as PDF.')
  const profile = mkdtempSync(join(tmpdir(), 'deck-chrome-'))
  const port = 9300 + Math.floor(Math.random() * 500)
  const proc = spawn(bin, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: 'ignore' })

  let target
  for (let i = 0; i < 100 && !target; i++) {
    await new Promise((r) => setTimeout(r, 100))
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      target = list.find((x) => x.type === 'page')
    } catch {}
  }
  if (!target) throw new Error('Chrome did not start')

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((r, j) => ((ws.onopen = r), (ws.onerror = j)))
  let id = 0
  const pending = new Map()
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)
    }
  }
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id
      pending.set(n, { resolve, reject })
      ws.send(JSON.stringify({ id: n, method, params }))
    })

  const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value
  return {
    send,
    evaluate,
    async goto(url, readyExpr = 'document.body && document.body.dataset.ready === "1"', timeoutMs = 20000) {
      await send('Page.navigate', { url })
      const t0 = Date.now()
      while (!(await evaluate(readyExpr).catch(() => false))) {
        if (Date.now() - t0 > timeoutMs) throw new Error('Timed out waiting for ' + url)
        await new Promise((r) => setTimeout(r, 100))
      }
    },
    async close() {
      ws.close()
      proc.kill()
      await new Promise((r) => setTimeout(r, 300))
      rmSync(profile, { recursive: true, force: true })
    },
  }
}
