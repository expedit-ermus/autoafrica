import { chromium } from 'playwright'

const browser = await chromium.launch()
const pages = ['/', '/auth/login', '/auth/register', '/dashboard', '/dashboard/marketplace', '/dashboard/help', '/dashboard/crm', '/dashboard/payments']
const viewports = [
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'tablet', w: 768, h: 1024 },
]
for (const vp of viewports) {
  console.log('=== ' + vp.name + ' ' + vp.w + 'px ===')
  for (const p of pages) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
    await page.goto('http://localhost:3000' + p, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(1200)
    const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }))
    const status = o.sw > o.cw ? 'DEBORDEMENT!' : 'OK'
    console.log(`${status}  ${p}  scroll=${o.sw} viewport=${o.cw}`)
    await page.close()
  }
}
await browser.close()
