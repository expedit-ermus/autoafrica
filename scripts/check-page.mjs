import { chromium } from 'playwright'

const url = process.argv[2] || 'https://autoafrique-saas.vercel.app/'
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
  const title = await page.title()
  const bodyText = (await page.locator('body').innerText()).substring(0, 400)
  console.log('URL:', url)
  console.log('TITLE:', title)
  console.log('BODY:', bodyText.replace(/\n+/g, ' | '))
  console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
} catch (e) {
  console.log('NAVIGATION ERROR:', e.message)
  console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
}

await browser.close()
