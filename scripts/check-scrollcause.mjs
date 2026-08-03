import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:3000'
const pagePath = process.argv[3] || '/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

try {
  await page.goto(base + pagePath, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2000)

  const r = await page.evaluate(() => {
    const sw = document.documentElement.scrollWidth
    const items = []
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0) continue
      // elements whose right edge is near scrollWidth
      if (r.right >= sw - 2 && r.right <= sw + 2) {
        items.push({
          tag: el.tagName,
          cls: (typeof el.className === 'string' ? el.className : '').slice(0, 80),
          left: Math.round(r.left),
          right: Math.round(r.right),
          w: Math.round(r.width),
          pos: getComputedStyle(el).position,
          parent: el.parentElement ? (el.parentElement.className ? String(el.parentElement.className).slice(0, 50) : el.parentElement.tagName) : '',
        })
      }
    }
    const seen = new Map()
    for (const it of items) { const k = it.tag + '|' + it.cls; if (!seen.has(k)) seen.set(k, it) }
    return { scrollWidth: sw, items: [...seen.values()].slice(0, 12) }
  })
  console.log('scrollWidth:', r.scrollWidth)
  if (r.items.length === 0) console.log('aucun élément au bord')
  for (const o of r.items) console.log(`<${o.tag} "${o.cls}"> left=${o.left} right=${o.right} w=${o.w} pos=${o.pos} parent="${o.parent}"`)
} catch (e) {
  console.log('NAV ERROR:', e.message)
}

await browser.close()
