import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:3000'
const pagePath = process.argv[3] || '/dashboard/help'
const browser = await chromium.launch()
const page = await browser.newPage()

const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push('[console] ' + msg.text()) })
page.on('pageerror', (err) => errors.push('[pageerror] ' + err.message))

try {
  await page.goto(base + '/auth/login', { waitUntil: 'networkidle', timeout: 60000 })
  await page.fill('input[type="email"], input[name="email"], input[type="text"]', 'moussa@example.com').catch(() => {})
  await page.fill('input[type="password"], input[name="password"]', 'password123').catch(() => {})
  await page.click('button[type="submit"], button:has-text("Se connecter")').catch(() => {})
  await page.waitForTimeout(6000)

  await page.goto(base + pagePath, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2500)

  console.log('PAGE:', pagePath)

  // Try to find and fill contact form on help page
  const emailInputs = page.locator('input[type="email"]')
  console.log('Inputs email:', await emailInputs.count())
  const textInputs = page.locator('input[type="text"], input:not([type])')
  console.log('Inputs texte:', await textInputs.count())

  // Fill contact form
  await emailInputs.first().fill('test@example.com').catch(() => {})
  const nameInput = page.locator('input[placeholder*="Nom"], input[placeholder*="votre nom"], input#help-name').first()
  await nameInput.fill('Test User').catch(() => {})
  const msgArea = page.locator('textarea').first()
  await msgArea.fill('Message de test depuis le script de validation.').catch(() => {})

  const submitBtn = page.locator('button[type="submit"], button:has-text("Envoyer"), button:has-text("Envoi")').first()
  console.log('Bouton submit présent:', await submitBtn.count() > 0)
  if (await submitBtn.count() > 0) {
    await submitBtn.click().catch((e) => console.log('CLICK ERR:', e.message))
    await page.waitForTimeout(1500)
    const toast = await page.locator('[role="status"], .toast, [class*="toast"]:visible').first().innerText().catch(() => '')
    console.log('Toast après envoi:', toast)
  }

  // Check for horizontal overflow issues (gabarit)
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth }
  })
  console.log('Largeur document:', overflow.scrollWidth, 'vs viewport:', overflow.clientWidth, overflow.scrollWidth > overflow.clientWidth ? '=> DEBORDEMENT!' : '=> OK')

  console.log('ERRORS:', errors.length ? '\n' + errors.slice(0, 5).join('\n') : 'none')
} catch (e) {
  console.log('NAV ERROR:', e.message)
  console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
}

await browser.close()
