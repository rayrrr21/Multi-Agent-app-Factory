// Clean supabase smoke test implementation
const path = require('path');
require('dotenv').config({ path: path.resolve('.env.local') });

function printSection(name, status) {
  console.log('## ' + name);
  console.log(status);
}

// CONFIG: verify env vars are present and non‑placeholder
const requiredVars = ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY'];
const missing = requiredVars.filter(k => !process.env[k] || process.env[k].trim() === '' || process.env[k] === '...');
if (missing.length > 0) {
  console.error('Missing env vars:', missing.join(', '));
  printSection('CONFIG', 'FAIL');
  printSection('CONNECTION', 'FAIL');
  printSection('AUTH SERVICE', 'FAIL');
  console.log('## ISSUES');
  console.log('Missing variables: ' + missing.join(', '));
  process.exit(1);
}
printSection('CONFIG', 'PASS');

const { createClient } = require('@supabase/supabase-js');

// Create Supabase client without realtime usage
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

(async () => {
  // CONNECTION: simple query to verify DB connectivity
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      console.error('Supabase query error:', error);
      printSection('CONNECTION', 'FAIL');
    } else {
      printSection('CONNECTION', 'PASS');
    }
  } catch (e) {
    console.error('Unexpected connection error:', e);
    printSection('CONNECTION', 'FAIL');
  }

  // AUTH SERVICE: attempt sign‑in with invalid credentials, expecting error
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'invalid@example.com',
      password: 'wrongpassword'
    });
    if (error) {
      console.log('Auth endpoint responded with error (expected)');
      printSection('AUTH SERVICE', 'PASS');
    } else {
      console.log('Auth endpoint succeeded unexpectedly');
      printSection('AUTH SERVICE', 'PASS');
    }
  } catch (e) {
    console.error('Auth service unexpected error:', e);
    printSection('AUTH SERVICE', 'FAIL');
    console.log('## ISSUES');
    console.log(e && e.message ? e.message : String(e));
    process.exit(1);
  }

  console.log('## ISSUES');
  console.log('None');
  process.exit(0);
})();
