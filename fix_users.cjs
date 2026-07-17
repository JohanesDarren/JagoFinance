const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const defaultCompanyId = '00000000-0000-0000-0000-000000000001';

  // Find all users who don't have a company_id and assign them to the default company
  const { data, error } = await supabase
    .from('users')
    .update({ 
      company_id: defaultCompanyId,
      role: 'super_admin' // Give them super admin so they can test everything
    })
    .is('company_id', null)
    .select();

  if (error) {
    console.error("Update error:", error);
  } else {
    console.log("Updated users:", data);
  }
}

run();
