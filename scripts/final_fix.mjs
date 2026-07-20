import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvptuknzpgadkhyvoxzc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cHR1a256cGdhZGtoeXZveHpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM3MDE0OCwiZXhwIjoyMDk3OTQ2MTQ4fQ.qru2Ekwh-p1txKMpvW7yhlArT7A6QwkNWCoIw-xjRsM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function finalFix() {
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const soobinAuth = authUsers.users.find(u => u.email === 'soobin@jagofinance.com');
    if (!soobinAuth) {
        console.error('Soobin auth user not found!');
        return;
    }

    // delete if exists just in case
    await supabase.from('users').delete().eq('email', 'soobin@jagofinance.com');

    const { error: insertError } = await supabase.from('users').insert({
        id: soobinAuth.id,
        company_id: '00000000-0000-0000-0000-000000000001',
        role: 'karyawan',
        full_name: 'Soobin Karyawan',
        email: 'soobin@jagofinance.com'
    });

    if (insertError) {
        console.error('Error inserting:', insertError);
    } else {
        console.log('Successfully fully fixed soobin');
    }
}
finalFix();
