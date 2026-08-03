import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:3000'
const pages = (process.argv[3] || '/dashboard/payments,/dashboard/analytics,/dashboard/orders,/dashboard/marketplace').split(',')
const browser = await chromium.launch()
const page = await browser.newPage()

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push('[console] ' + msg.text())
})
page.on('pageerror', (err) => errors.push('[pageerror] ' + err.message + '\n' + (err.stack || '')))

await page.goto(base + '/auth/login', { waitUntil: 'networkidle', timeout: 60000 })
await page.fill('input[type="email"], input[name="email"], input[type="text"]', 'moussa@example.com').catch(() => {})
await page.fill('input[type="password"], input[name="password"]', 'password123').catch(() => {})
await page.click('button[type="submit"], button:has-text("Se connecter")').catch(() => {})
await page.waitForTimeout(5000)

for (const p of pages) {
  const localErrors = []
  const onErr = (err) => localErrors.push('[pageerror] ' + err.message)
  const onCons = (msg) => { if (msg.type() === 'error') localErrors.push('[console] ' + msg.text()) }
  page.on('pageerror', onErr)
  page.on('console', onCons)
  try {
    await page.goto(base + p, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(2000)
    const bodyText = (await page.locator('body').innerText()).substring(0, 200).replace(/\n+/g, ' | ')
    console.log('== ' + p)
    console.log('  BODY:', bodyText)
    console.log('  ERRORS:', localErrors.length ? '\n' + localErrors.join('\n') : 'none')
  } catch (e) {
    console.log('== ' + p + ' => NAV ERROR: ' + e.message)
  }
  page.removeListener('pageerror', onErr)
  page.removeListener('console', onCons)
}

console.log('== ALL GLOBAL ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
await browser.close()
