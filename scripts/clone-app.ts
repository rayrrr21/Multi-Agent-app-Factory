/* scripts/clone-app.ts */
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

function replacePlaceholders(content: string, replacements: Record<string, string>) {
  let result = content;
  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = new RegExp(`\\$\\{${key}\\}`, 'g');
    result = result.replace(placeholder, value);
  }
  return result;
}

function main() {
  const args = process.argv.slice(2);
  const nameIndex = args.indexOf('--name');
  if (nameIndex === -1 || !args[nameIndex + 1]) {
    console.error('Usage: npm run clone-app -- --name <AppName>');
    process.exit(1);
  }
  const rawName = args[nameIndex + 1];
  const appName = rawName.replace(/\s+/g, ''); // remove spaces
  const slug = appName.toLowerCase();
  const bundleId = `com.example.${slug}`;
  const androidPackage = bundleId;
  const appScheme = slug;

  const templatePath = path.resolve(__dirname, '../apps/template-mobile');
  const newAppPath = path.resolve(__dirname, `../apps/${slug}`);

  if (fs.existsSync(newAppPath)) {
    console.error(`App "${slug}" already exists at ${newAppPath}`);
    process.exit(1);
  }

  // Copy template directory recursively
  execSync(`xcopy "${templatePath}" "${newAppPath}" /E /I /H /Y`);

  // Files to replace placeholders in
  const filesToPatch = [
    'app.json',
    'eas.json',
    '.env.example',
    'package.json',
    'tsconfig.json',
  ];

  const replacements = {
    APP_NAME: appName,
    APP_SLUG: slug,
    BUNDLE_ID: bundleId,
    ANDROID_PACKAGE: androidPackage,
    APP_SCHEME: appScheme,
  };

  for (const relative of filesToPatch) {
    const filePath = path.join(newAppPath, relative);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const newContent = replacePlaceholders(content, replacements);
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  }

  // Update root package.json workspaces
  const rootPkgPath = path.resolve(__dirname, '../package.json');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
  if (!rootPkg.workspaces.includes('apps/*')) {
    // already includes pattern, nothing needed
  }
  // No explicit addition needed because pattern covers new app
  fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2), 'utf8');

  console.log(`✅ Created new app "${appName}" at ${newAppPath}`);
}

main();
