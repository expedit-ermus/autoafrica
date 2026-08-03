import { chromium } from 'playwright'

const url = process.argv[2] || 'https://autoafrique-saas.vercel.app/'
const browser = await chromium.launch()
const page = await browser.newPage()

const t0 = Date.now()
const httpErrors = []
page.on('response', (r) => {
  if (r.status() >= 400) httpErrors.push(`[HTTP ${r.status()}] ${r.url()}`)
})
page.on('requestfailed', (r) => httpErrors.push(`[FAILED] ${r.url()} :: ${r.failure()?.errorText || ''}`))

try {
  await page.goto(url, { waitUntil: 'load', timeout: 120000 })
  console.log('LOAD event: ' + (Date.now() - t0) + 'ms')
  await page.waitForTimeout(8000)
  console.log('idle+8s: ' + (Date.now() - t0) + 'ms')

  const perf = await page.evaluate(() => {
    const slow = performance
      .getEntriesByType('resource')
      .map((e) => ({ n: e.name.split('/').pop()?.slice(0, 50), d: Math.round(e.duration) }))
      .filter((e) => e.d > 2000)
    return {
      domContentLoaded: Math.round(performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart),
      loadComplete: Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart),
      slow,
    }
  })
  console.log('domContentLoaded:', perf.domContentLoaded, 'ms | loadComplete:', perf.loadComplete, 'ms')
  console.log('Ressources > 2s:', perf.slow.length ? JSON.stringify(perf.slow, null, 1) : 'aucune')

  const bodyLen = (await page.locator('body').innerText()).length
  console.log('BODY texte:', bodyLen, 'chars')
  console.log('HTTP/erreurs:', httpErrors.length ? '\n' + httpErrors.join('\n') : 'aucune')
} catch (e) {
  console.log('NAV ERROR after ' + (Date.now() - t0) + 'ms:', e.message)
  console.log('HTTP/erreurs:', httpErrors.length ? '\n' + httpErrors.join('\n') : 'aucune')
}

await browser.close()
