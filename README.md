# E2E Testing

This project includes a Playwright end‑to‑end test suite for the Expo web version of the Factory Test app.

## Local execution

1. Install the required browsers (once):
   `
   npx playwright install chromium
   `
2. Create a local .env.e2e.local file (already in .gitignore) with the following variables:
   `
   E2E_USER_EMAIL=your_test_email@example.com
   E2E_USER_PASSWORD=your_test_password
   `
3. Run the full suite:
   `
   npm run e2e
   `
   or use the helper script:
   `
   powershell scripts\e2e-automation.ps1
   `

## CI integration

The GitHub Actions workflow (.github/workflows/ci.yml) now runs the Playwright suite and injects the necessary secrets:
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY
- E2E_USER_EMAIL
- E2E_USER_PASSWORD

## Tests included

- e2e/home-logo.spec.ts – verifies the home page logo is visible.
- e2e/login-logo.spec.ts – logs in using the test credentials and checks the logo after login.

For more information see the scripts/ directory.
