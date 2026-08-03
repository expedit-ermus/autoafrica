import { chromium } from 'playwright'

const base = process.argv[2] || 'https://autoafrique-saas.vercel.app'
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(base + '/auth/login', { waitUntil: 'networkidle', timeout: 60000 })
await page.fill('input[type="email"], input[name="email"], input[type="text"]', 'moussa@example.com').catch(() => {})
await page.fill('input[type="password"], input[name="password"]', 'password123').catch(() => {})
await page.click('button[type="submit"], button:has-text("Se connecter")').catch(() => {})
await page.waitForTimeout(6000)

const results = []
for (const path of ['/api/v1/products?pageSize=5', '/api/v1/orders?pageSize=5', '/api/v1/payments?pageSize=5']) {
  try {
    const res = await page.evaluate(async (p) => {
      const r = await fetch(p, { credentials: 'include' })
      const j = await r.json()
      return { status: r.status, success: j.success, keys: Object.keys(j), dataKeys: j.data ? Object.keys(j.data) : null, hasDataArr: !!(j.data && Array.isArray(j.data.data)), sampleType: j.data && j.data.data ? typeof j.data.data[0] : typeof j.data }
    }, path)
    results.push(path + ' => ' + JSON.stringify(res))
  } catch (e) {
    results.push(path + ' => ERROR ' + e.message)
  }
}
console.log(results.join('\n'))
await browser.close()
