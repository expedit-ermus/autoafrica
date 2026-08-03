import { chromium } from 'playwright'

const pagePath = process.argv[2] || '/dashboard/payments'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:3000' + pagePath, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(2000)

const r = await page.evaluate(() => {
  const main = document.querySelector('main')
  if (!main) return 'no main'
  main.style.width = '358px'
  main.style.maxWidth = '358px'
  const out = []
  for (const el of main.querySelectorAll('*')) {
    if (el.scrollWidth > el.clientWidth + 2) {
      out.push({
        tag: el.tagName,
        cls: (typeof el.className === 'string' ? el.className : '').slice(0, 60),
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        text: (el.textContent || '').slice(0, 25),
      })
    }
  }
  out.sort((a, b) => b.scrollW - a.scrollW)
  return out.slice(0, 25)
})
for (const o of r) console.log(`<${o.tag} "${o.cls}"> "${o.text}" scrollW=${o.scrollW} clientW=${o.clientW}`)
await browser.close()
