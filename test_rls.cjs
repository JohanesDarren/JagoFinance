const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  // Login as superadmin
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'superadmin@jagofinance.com',
    password: 'password'
  });

  if (authErr) {
    console.error("Auth error:", authErr.message);
    return;
  }

  console.log("Logged in:", authData.user.id);

  // Check role and company
  const { data: profile } = await supabase.from('users').select('*').eq('id', authData.user.id).single();
  console.log("Profile:", profile);

  // Test RPC functions if possible, else just try inserting
  const { data, error } = await supabase
    .from('branches')
    .insert([{
      company_id: profile.company_id,
      name: 'Test Branch CLI',
      location: 'Test Loc',
      manager_name: 'Test Mgr',
      status: 'active'
    }])
    .select();

  if (error) {
    console.error("Insert error:", error);
  } else {
    console.log("Insert success:", data);
  }
}

run();
