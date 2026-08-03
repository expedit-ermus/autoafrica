import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:3000'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push('[console] ' + msg.text()) })
page.on('pageerror', (err) => errors.push('[pageerror] ' + err.message))
page.on('requestfailed', (req) => errors.push('[requestfailed] ' + req.url() + ' :: ' + (req.failure()?.errorText || '')))

try {
  await page.goto(base + '/auth/login', { waitUntil: 'networkidle', timeout: 60000 })
  await page.fill('input[type="email"], input[name="email"], input[type="text"]', 'moussa@example.com').catch(() => {})
  await page.fill('input[type="password"], input[name="password"]', 'password123').catch(() => {})
  await page.click('button[type="submit"], button:has-text("Se connecter")').catch(() => {})
  await page.waitForTimeout(6000)

  await page.goto(base + '/dashboard', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)

  const drawer = page.locator('div.w-\\[280px\\]')
  console.log('Drawer present:', await drawer.count() > 0)
  console.log('Drawer box (avant):', JSON.stringify(await drawer.boundingBox().catch(() => null)))

  const burger = page.locator('header button').first()
  await burger.click().catch((e) => console.log('CLICK ERROR:', e.message))
  await page.waitForTimeout(1000)

  console.log('Drawer box (apres):', JSON.stringify(await drawer.boundingBox().catch(() => null)))
  console.log('Drawer visible:', await drawer.isVisible().catch(() => false))

  const links = await drawer.locator('a').count()
  console.log('Liens dans le drawer:', links)
  const text = await drawer.innerText().catch(() => '(aucun)')
  console.log('Contenu drawer:', text.substring(0, 250).replace(/\n+/g, ' | '))

  console.log('ERRORS:', errors.length ? '\n' + errors.slice(0, 4).join('\n') : 'none')
} catch (e) {
  console.log('NAV ERROR:', e.message)
  console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
}

await browser.close()
