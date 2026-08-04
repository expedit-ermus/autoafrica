import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:3000'
const pagePath = process.argv[3] || '/dashboard/vehicles'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto(base + pagePath, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(2000)

const r = await page.evaluate(() => {
  const flex1 = [...document.querySelectorAll('*')].find(e => (typeof e.className === 'string' && e.className.includes('flex-1') && e.className.includes('lg:ml-64')))
  if (flex1) flex1.style.minWidth = '0'
  const out = []
  for (const el of document.querySelectorAll('body *')) {
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.right <= 392) continue
    let clipped = false
    let n = el.parentElement
    while (n) {
      const o = getComputedStyle(n).overflowX
      if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') { clipped = true; break }
      n = n.parentElement
    }
    if (clipped) continue
    out.push({
      tag: el.tagName,
      cls: (typeof el.className === 'string' ? el.className : '').slice(0, 60),
      L: Math.round(rect.left),
      R: Math.round(rect.right),
      w: Math.round(rect.width),
    })
  }
  return { docScroll: document.documentElement.scrollWidth, out: out.slice(0, 15) }
})
console.log('docScroll:', r.docScroll)
for (const o of r.out) console.log(`<${o.tag} "${o.cls}"> L=${o.L} R=${o.R} w=${o.w}`)
await browser.close()
