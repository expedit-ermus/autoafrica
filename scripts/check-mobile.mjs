import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:3000'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })

const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push('[console] ' + msg.text()) })
page.on('pageerror', (err) => errors.push('[pageerror] ' + err.message))

const pages = ['/', '/auth/login', '/auth/register', '/dashboard', '/dashboard/marketplace', '/dashboard/help', '/dashboard/crm', '/dashboard/vehicles', '/dashboard/orders', '/dashboard/payments', '/dashboard/finance', '/dashboard/settings', '/dashboard/profile', '/dashboard/cart', '/dashboard/analytics', '/dashboard/delivery']

try {
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(1500)
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      return { sw: doc.scrollWidth, cw: doc.clientWidth }
    })
    const status = overflow.sw > overflow.cw ? 'DEBORDEMENT!' : 'OK'
    console.log(`${status}  ${p}  scroll=${overflow.sw} viewport=${overflow.cw}`)
  }
  console.log('ERRORS (fin):', errors.length ? errors.length + ' erreurs console' : 'none')
} catch (e) {
  console.log('NAV ERROR:', e.message)
}

await browser.close()
