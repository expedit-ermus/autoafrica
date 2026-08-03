import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:3000/dashboard/help', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(2000)

const r = await page.evaluate(() => {
  const flex1 = [...document.querySelectorAll('*')].find(e => (typeof e.className === 'string' && e.className.includes('flex-1') && e.className.includes('lg:ml-64')))
  const before = { flex1: flex1 && Math.round(flex1.getBoundingClientRect().width), docScroll: document.documentElement.scrollWidth }
  flex1.style.minWidth = '0'
  const after = {
    flex1: flex1 && Math.round(flex1.getBoundingClientRect().width),
    main: document.querySelector('main') && Math.round(document.querySelector('main').getBoundingClientRect().width),
    docScroll: document.documentElement.scrollWidth,
  }
  // biggest scrollWidth element inside main after fix
  const big = []
  if (document.querySelector('main')) {
    for (const el of document.querySelectorAll('main *')) {
      if (el.scrollWidth > 400) big.push({ cls: (typeof el.className === 'string' ? el.className : '').slice(0, 50), scrollW: el.scrollWidth, clientW: el.clientWidth, overflowX: getComputedStyle(el).overflowX })
    }
  }
  return { before, after, big: big.slice(0, 10) }
})
console.log(JSON.stringify(r, null, 1))
await browser.close()
