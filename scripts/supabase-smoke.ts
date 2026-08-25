// scripts/supabase-smoke.ts
import * as dotenv from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

// Helper to print section result
function printSection(name: string, status: string) {
  console.log(`## ${name}`);
  console.log(status);
}

// Validate config (env vars)
const requiredVars = ["EXPO_PUBLIC_SUPABASE_URL", "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];
let missing = requiredVars.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error("Missing env vars:", missing.join(", "));
  printSection("CONFIG", "FAIL");
  printSection("CONNECTION", "FAIL");
  printSection("AUTH SERVICE", "FAIL");
  console.log("## ISSUES");
  console.log(`Missing variables: ${missing.join(", ")}`);
  process.exit(1);
}

printSection("CONFIG", "PASS");

// Attempt connection and auth by making a cheap request
(async () => {
  try {
    const supabase: SupabaseClient = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL as string,
      process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string
    );

    const { data, error } = await supabase.from("profiles").select("id").limit(1);

    if (error) {
      console.error("Supabase request error:", error);
      printSection("CONNECTION", "FAIL");
      printSection("AUTH SERVICE", "FAIL");
      console.log("## ISSUES");
      console.log(error.message ?? "Unknown error");
      process.exit(1);
    }

    // If we get here, connection/auth succeeded
    printSection("CONNECTION", "PASS");
    printSection("AUTH SERVICE", "PASS");
    console.log("## ISSUES");
    console.log("None");
    process.exit(0);
  } catch (e) {
    console.error("Unexpected error:", e);
    printSection("CONNECTION", "FAIL");
    printSection("AUTH SERVICE", "FAIL");
    console.log("## ISSUES");
    console.log((e as any).message ?? "Unknown error");
    process.exit(1);
  }
})();
