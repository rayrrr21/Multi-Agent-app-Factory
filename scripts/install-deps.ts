// install-deps.ts
// Simple TypeScript script to install project dependencies using npm ci.
import { execSync } from "child_process";

function runInstall() {
  console.log("🔧 Installing project dependencies with 'npm ci' ...");
  try {
    // Use npm ci to get a clean install based on package-lock.json
    execSync("npm ci", { stdio: "inherit" });
    console.log("✅ Dependencies installed successfully.");
  } catch (err) {
    console.error("❌ Dependency installation failed.", err);
    process.exit(1);
  }
}

runInstall();
