import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:3000/'
const browser = await chromium.launch()
const page = await browser.newPage()

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push('[console] ' + msg.text())
})
page.on('response', (res) => {
  if (res.status() >= 400) errors.push(`[HTTP ${res.status()}] ${res.url()}`)
})

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)
  console.log('URL:', url)
  console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
} catch (e) {
  console.log('NAVIGATION ERROR:', e.message)
  console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
}

await browser.close()
