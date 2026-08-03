import { chromium } from 'playwright'

const browser = await chromium.launch()
for (const w of [768, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 1024 } })
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)
  const o = await page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('body *')) {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.right <= window.innerWidth + 2) continue
      let clipped = false
      let n = el.parentElement
      while (n) {
        const ox = getComputedStyle(n).overflowX
        if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') { clipped = true; break }
        n = n.parentElement
      }
      if (clipped) continue
      out.push({ tag: el.tagName, cls: (typeof el.className === 'string' ? el.className : '').slice(0, 60), L: Math.round(rect.left), R: Math.round(rect.right) })
    }
    return { scroll: document.documentElement.scrollWidth, out: out.slice(0, 12) }
  })
  console.log('=== ' + w + 'px docScroll=' + o.scroll + ' ===')
  for (const x of o.out) console.log(`  <${x.tag} "${x.cls}"> L=${x.L} R=${x.R}`)
  await page.close()
}
await browser.close()
