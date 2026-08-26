// scripts/check-supabase-key-isolation.ts
// This script scans the repository for any reference to elevated Supabase keys
// in client‑facing code and fails if any are found.

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

// Elevated keys that must never appear in frontend bundles.
const ELEVATED_KEYS = ['SUPABASE_SERVICE_ROLE_KEY'];

// Directories considered client‑side (bundled for the web/app).
const CLIENT_DIRS = ['apps', 'packages'];

function isClientFile(filePath: string): boolean {
  const parts = filePath.split(path.sep);
  return parts.some(p => CLIENT_DIRS.includes(p));
}

function scan(): string[] {
  const pattern = '**/*.{ts,tsx,js,jsx}';
  const files = glob.sync(pattern, {
    cwd: process.cwd(),
    absolute: true,
    ignore: ['node_modules/**', 'dist/**', '**/node_modules/**'],
  });
  const violations: string[] = [];
  for (const file of files) {
    if (!isClientFile(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    for (const key of ELEVATED_KEYS) {
      const regex = new RegExp(key, 'g');
      if (regex.test(content)) {
        violations.push(`${file} contains reference to ${key}`);
      }
    }
  }
  return violations;
}

function main() {
  const violations = scan();
  if (violations.length === 0) {
    console.log('✅ Supabase key isolation PASS – no elevated keys in client code');
    process.exit(0);
  }
  console.error('❌ Supabase key isolation FAIL – elevated keys found in client code:');
  for (const v of violations) {
    console.error('  -', v);
  }
  process.exit(1);
}

main();
