import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:3000'
const pagePath = process.argv[3] || '/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

try {
  await page.goto(base + pagePath, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2000)

  const result = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const out = []
    // Check if any ancestor has overflow hidden/clip
    const clipped = (el) => {
      let n = el.parentElement
      while (n) {
        const o = getComputedStyle(n).overflowX
        if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') return true
        n = n.parentElement
      }
      return false
    }
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0) continue
      if (r.right > vw + 2 && !clipped(el)) {
        out.push({
          tag: el.tagName,
          cls: (typeof el.className === 'string' ? el.className : '').slice(0, 60),
          right: Math.round(r.right),
          width: Math.round(r.width),
        })
      }
    }
    // dedupe
    const seen = new Map()
    for (const it of out) {
      const key = it.tag + '|' + it.cls + '|' + it.right
      if (!seen.has(key)) seen.set(key, it)
    }
    return [...seen.values()].slice(0, 12)
  })

  console.log('PAGE:', pagePath, '| viewport 390')
  if (result.length === 0) console.log('AUCUN débordement non-clippé')
  for (const o of result) console.log(`  <${o.tag} "${o.cls}"> right=${o.right} w=${o.width}`)
} catch (e) {
  console.log('NAV ERROR:', e.message)
}

await browser.close()
