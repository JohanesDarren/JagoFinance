import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase URL or Service Role Key in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const EXECUTIVES = [
  {
    email: 'jagoai.business@gmail.com',
    password: 'We.LoveYanto1@',
    full_name: 'Admin JagoAI',
    surname: 'Business',
    national_id: 'CEO001'
  }
];

const seedExecutives = async () => {
  console.log("Starting seeding process for Executive Finance accounts...");

  // Seed finance_settings
  console.log("Seeding finance_settings...");
  const { error: fsErr } = await supabaseAdmin
    .from('finance_settings')
    .upsert([{ id: 1, current_balance: 1000000000 }]);

  if (fsErr) {
    console.error("Error seeding finance_settings:", fsErr);
  }

  for (const exec of EXECUTIVES) {
    console.log(`Processing user: ${exec.email}...`);
    let userId = '';

    // 1. Create User in auth.users
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: exec.email,
      password: exec.password,
      email_confirm: true
    });

    if (authErr) {
      if (authErr.message?.includes('already') || authErr.code === 'email_exists' || authErr.status === 422) {
        console.log(`User ${exec.email} already exists in auth.users. Fetching existing user ID to recreate profile...`);
        // Find existing user ID using listUsers (admin only)
        const { data: listData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
        if (listErr) {
          console.error("Error fetching user list:", listErr);
          continue;
        }
        const existingUser = listData.users.find((u: any) => u.email === exec.email);
        if (existingUser) {
          userId = existingUser.id;
          // Optionally update password to ensure it matches
          await supabaseAdmin.auth.admin.updateUserById(userId, { password: exec.password });
        } else {
          console.error("Could not find existing user ID.");
          continue;
        }
      } else {
        console.error(`Error creating user ${exec.email}:`, authErr);
        continue;
      }
    } else {
      userId = authData.user.id;
    }

    // 2. Create Profile
    console.log(`Upserting profile for user ${exec.email}...`);
    const { error: profileErr } = await supabaseAdmin
      .from('profiles')
      .upsert([{
        id: userId,
        full_name: exec.full_name,
        surname: exec.surname,
        national_id: exec.national_id,
        role: 'admin'
      }]);

    if (profileErr) {
      console.error(`Error creating profile for ${exec.email}:`, profileErr);
    } else {
      console.log(`Successfully provisioned executive account: ${exec.email}`);
    }
  }

  console.log("Seeding complete.");
};

seedExecutives().catch(console.error);
