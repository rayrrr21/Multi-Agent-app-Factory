Continue = 'Stop'
Write-Host 'Installing Playwright Chromium browsers...'
npx playwright install chromium
Write-Host 'Running E2E test suite...'
npm run e2e
