import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3005',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx next start -p 3005',
    url: 'http://localhost:3005',
    reuseExistingServer: false,
    timeout: 120000,
    // Serveur de test hermetique : les valeurs sont fournies explicitement pour
    // ne pas dependre de l ordre de precedence des fichiers .env locaux (un
    // .env.production.local issu de `vercel env pull` contient des valeurs
    // vides qui, en mode production, ecrasent le secret et cassent l auth).
    env: {
      DATABASE_URL: process.env.E2E_DATABASE_URL ?? 'file:./dev.db',
      JWT_SECRET: process.env.E2E_JWT_SECRET ?? 'e2e-signing-key-local-tests-only-do-not-reuse',
    },
  },
});
