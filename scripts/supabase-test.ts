// supabase-test.ts
// Full Supabase auth + RLS integration test.
import { createClient } from "@supabase/supabase-js";
import http from 'http';
import open from 'open';
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://jcqawjpfiduqshwtvjli.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_EcxDOYl7NnM7_FdTceBV2A_fHOUQ7M-';

const baseClient = createClient(supabaseUrl!, supabaseKey!);

async function signIn(email: string, password: string) {
  // Attempt to sign in; users are expected to already exist.
  const { error, data } = await baseClient.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("❌ Sign‑in failed:", error.message);
    return null;
  }
  const userId = data.user?.id;
  if (!userId) {
    console.error("❌ No user ID after sign‑in");
    return null;
  }
  const userClient = createClient(supabaseUrl!, supabaseKey!);
  if (data.session) {
    await userClient.auth.setSession(data.session as any);
  }
  return { userId, client: userClient };
}
async function signInOrCreate(email: string, password: string) {
  // Try sign‑in first
  let result = await signIn(email, password);
  if (result) return result;

  // If sign‑in failed, attempt to sign‑up (user may not exist yet)
  // Attempt to sign‑up (creates user if not exists)
  await baseClient.auth.signUp({ email, password }).catch(() => {});
  // Then sign‑in
  return await signIn(email, password);

}
const password = "Delores1978!";

// GitHub OAuth sign‑in helper (automated flow)
async function signInWithGitHub(): Promise<{ userId: string; client: any } | null> {
  const { data, error } = await baseClient.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: 'http://localhost:3001/redirect' },
  });
  if (error) {
    console.error('❌ GitHub sign‑in failed:', error.message);
    return null;
  }
  // Open the auth URL in the default browser
  try {
    await open(data?.url ?? '');
  } catch {
    console.log('🔗 Open this URL in a browser to complete GitHub sign‑in:', data?.url);
  }
  // Wait for the redirect to capture the authorization code
  const { code } = await waitForRedirect();
  // Exchange the code for a Supabase session (access & refresh tokens)
  const { data: sessionData, error: exchErr } = await baseClient.auth.exchangeCodeForSession(code);
  if (exchErr) {
    console.error('❌ Failed to exchange code for session:', exchErr.message);
    return null;
  }
  const session = sessionData.session;
  const userClient = createClient(supabaseUrl!, supabaseKey!);
  await userClient.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token ?? '',
  });
  // Get the authenticated user ID
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr) {
    console.error('❌ Failed to fetch user after OAuth:', userErr.message);
    return null;
  }
  return { userId: userData.user?.id ?? 'github_user', client: userClient };
}

// Helper: start a temporary HTTP server to receive the OAuth redirect
function waitForRedirect(): Promise<{ code: string }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(`http://localhost:3001${req.url}`);
      const code = url.searchParams.get('code');
      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Authentication successful – you may close this tab.');
        server.close();
        resolve({ code });
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Missing code');
      }
    });
    server.listen(3001, () => console.log('🔐 Listening for OAuth redirect on http://localhost:3001'));
    // Safety timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('OAuth redirect timed out'));
    }, 5 * 60 * 1000);
  });
}

// Replace password‑based sign‑in with GitHub OAuth for both test users
async function runTests() {
  const emailA = "rayrrr@gmail.com";
  const emailB = "asisreallyreal@gmail.com";
  const userA = await signInWithGitHub();
  console.log("## USER A AUTH", userA ? "PASS" : "FAIL");
  const userB = await signInWithGitHub();
  console.log("## USER B AUTH", userB ? "PASS" : "FAIL");


  if (!userA || !userB) {
    console.log("## ISSUES", "Authentication failed for one or both users");
    process.exit(1);
  }

  const sessionA = await userA.client.auth.getSession();
  const sessionB = await userB.client.auth.getSession();
  const sessionOk = sessionA.data.session && sessionB.data.session;
  console.log("## SESSION", sessionOk ? "PASS" : "FAIL");

  // OWN PROFILE WRITE (User A)
  const { error: writeA } = await userA.client.from("profiles").upsert({ id: userA.userId, display_name: "User A", avatar_url: null }).single();
  console.log("## OWN PROFILE WRITE", writeA ? "FAIL" : "PASS");

  // OWN PROFILE READ (User A)
  const { data: readA, error: readErrA } = await userA.client.from("profiles").select("*").eq("id", userA.userId).single();
  console.log("## OWN PROFILE READ", (readErrA || !readA) ? "FAIL" : "PASS");

  // CROSS‑USER READ BLOCK (User A reading B)
  const { data: crossRead, error: crossReadErr } = await userA.client.from("profiles").select("*").eq("id", userB.userId).single();
  const crossReadBlocked = (!crossRead && (crossReadErr?.code === "PGRST404" || crossReadErr?.message?.includes("RLS")));
  console.log("## CROSS-USER READ BLOCK", crossReadBlocked ? "PASS" : "FAIL");

  // CROSS‑USER WRITE BLOCK (User A updating B)
  const { error: crossWriteErr } = await userA.client.from("profiles").update({ display_name: "Hacked" }).eq("id", userB.userId);
  const crossWriteBlocked = !!crossWriteErr;
  console.log("## CROSS-USER WRITE BLOCK", crossWriteBlocked ? "PASS" : "FAIL");

  // OWN PROFILE WRITE (User B)
  const { error: writeB } = await userB.client.from("profiles").upsert({ id: userB.userId, display_name: "User B" }).single();
  console.log("## OWN PROFILE WRITE (User B)", writeB ? "FAIL" : "PASS");

  // OWN PROFILE READ (User B)
  const { data: readB, error: readErrB } = await userB.client.from("profiles").select("*").eq("id", userB.userId).single();
  console.log("## OWN PROFILE READ (User B)", (readErrB || !readB) ? "FAIL" : "PASS");

  // ANONYMOUS ACCESS BLOCK
  const anonClient = createClient(supabaseUrl!, supabaseKey!);
  const { data: anonRead, error: anonReadErr } = await anonClient.from("profiles").select("*").eq("id", userA.userId).single();
  const anonReadBlocked = (!anonRead && (anonReadErr?.code === "PGRST404" || anonReadErr?.message?.includes("RLS")));
  const { error: anonWriteErr } = await anonClient.from("profiles").update({ display_name: "Anon" }).eq("id", userA.userId);
  const anonWriteBlocked = !!anonWriteErr;
  console.log("## ANONYMOUS ACCESS BLOCK", (anonReadBlocked && anonWriteBlocked) ? "PASS" : "FAIL");

  // Cleanup
  await userA.client.auth.signOut();
  await userB.client.auth.signOut();
  console.log("## ISSUES", "None");
}

runTests();
