// scripts/validate-supabase-env.ts
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const requiredVars = [
  "EXPO_PUBLIC_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
];

let missing = requiredVars.filter((key) => !process.env[key] || process.env[key]!.trim() === "");
if (missing.length > 0) {
  console.error("Missing environment variables:", missing.join(", "));
  process.exit(1);
}

process.exit(0);
