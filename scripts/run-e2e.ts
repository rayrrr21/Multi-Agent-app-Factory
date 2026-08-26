import { execSync } from 'child_process';
// Execute Supabase key isolation check, then Playwright test suite.
import * as path from 'path';

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.e2e.local') });
// Ensure Playwright browsers are installed
execSync('npx playwright install chromium', { stdio: 'inherit' });

try {
  console.log('🔍 Running Supabase key isolation check...');
  execSync('ts-node scripts/check-supabase-key-isolation.ts', { stdio: 'inherit' });
  console.log('✅ Key isolation check passed. Starting Playwright tests...');
  execSync('npx playwright test', { stdio: 'inherit' });
  console.log('✅ Playwright tests completed successfully.');
} catch (error) {
  console.error('❌ Run-e2e failed.', error);
  process.exit(1);
}

