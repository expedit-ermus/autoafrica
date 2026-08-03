import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:3000/'
const browser = await chromium.launch()
const page = await browser.newPage()

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push('[console] ' + msg.text())
})
page.on('pageerror', (err) => errors.push('[pageerror] ' + err.message + '\n' + (err.stack || '')))
page.on('requestfailed', (req) => errors.push('[requestfailed] ' + req.url() + ' :: ' + (req.failure()?.errorText || '')))

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)

  const imgs = await page.locator('img').evaluateAll((els) =>
    els.map((el) => ({
      src: el.currentSrc || el.src,
      complete: el.complete,
      naturalWidth: el.naturalWidth,
      alt: el.alt,
    }))
  )

  const failed = imgs.filter((i) => !i.complete || i.naturalWidth === 0)
  const fallback = imgs.filter((i) => i.src.includes('logo.png'))

  console.log('URL:', url)
  console.log('TITLE:', await page.title())
  console.log('TOTAL IMAGES:', imgs.length)
  console.log('FAILED IMAGES:', failed.length ? JSON.stringify(failed, null, 1) : 'none')
  console.log('LOGO.PNG FALLBACK USED:', fallback.length)
  console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
} catch (e) {
  console.log('NAVIGATION ERROR:', e.message)
  console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
}

await browser.close()
