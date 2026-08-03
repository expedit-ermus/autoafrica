import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message))
await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(3000)
const unique = [...new Set(errors)]
console.log('Total:', errors.length, 'Unique:', unique.length)
unique.slice(0, 20).forEach(e => console.log('-', e.slice(0, 150)))
await browser.close()
