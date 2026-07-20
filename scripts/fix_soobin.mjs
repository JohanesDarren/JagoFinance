import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvptuknzpgadkhyvoxzc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cHR1a256cGdhZGtoeXZveHpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM3MDE0OCwiZXhwIjoyMDk3OTQ2MTQ4fQ.qru2Ekwh-p1txKMpvW7yhlArT7A6QwkNWCoIw-xjRsM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSoobin() {
    const email = 'soobin@jagofinance.com';
    const password = 'Password123'; // Strong password meeting requirements

    console.log(`Creating auth user ${email}...`);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true
    });

    if (authError) {
        console.error('Error creating auth user:', authError);
        return;
    }

    const newId = authData.user.id;
    console.log(`Created auth user with ID: ${newId}. Updating public.users...`);
    
    const { data: oldUsers } = await supabase.from('users').select('*').eq('email', email);
    let oldProfile = null;
    if (oldUsers && oldUsers.length > 0) {
        oldProfile = oldUsers[0];
        console.log(`Deleting old public user with ID: ${oldProfile.id}`);
        await supabase.from('users').delete().eq('id', oldProfile.id);
    } else {
        oldProfile = {
            company_id: '00000000-0000-0000-0000-000000000001',
            role: 'karyawan',
            full_name: 'Soobin Karyawan'
        };
    }

    const { error: insertError } = await supabase.from('users').insert({
        id: newId,
        company_id: oldProfile.company_id || '00000000-0000-0000-0000-000000000001',
        role: oldProfile.role || 'karyawan',
        full_name: oldProfile.full_name || 'Soobin Karyawan',
        email: email
    });

    if (insertError) {
        console.error('Error inserting new profile:', insertError);
    } else {
        console.log(`Successfully fixed ${email}. Password is: ${password}`);
    }
}

fixSoobin();
