import { chromium } from 'playwright'

const base = process.argv[2] || 'https://autoafrique-saas.vercel.app'
const browser = await chromium.launch()
const page = await browser.newPage()

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push('[console] ' + msg.text())
})
page.on('pageerror', (err) => errors.push('[pageerror] ' + err.message + '\n' + (err.stack || '')))

try {
  await page.goto(base + '/auth/login', { waitUntil: 'networkidle', timeout: 60000 })
  await page.fill('input[type="email"], input[name="email"], input[type="text"]', 'moussa@example.com').catch(() => {})
  await page.fill('input[type="password"], input[name="password"]', 'password123').catch(() => {})
  await page.click('button[type="submit"], button:has-text("Se connecter")').catch(() => {})
  await page.waitForTimeout(6000)
  const url = page.url()
  await page.goto(base + '/dashboard', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)
  const title = await page.title()
  const bodyText = (await page.locator('body').innerText()).substring(0, 500)
  console.log('LOGIN URL:', url)
  console.log('DASHBOARD URL:', page.url())
  console.log('TITLE:', title)
  console.log('BODY:', bodyText.replace(/\n+/g, ' | '))
  console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
} catch (e) {
  console.log('ERROR:', e.message)
  console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
}

await browser.close()
