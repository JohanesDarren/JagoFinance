const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jvptuknzpgadkhyvoxzc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cHR1a256cGdhZGtoeXZveHpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM3MDE0OCwiZXhwIjoyMDk3OTQ2MTQ4fQ.qru2Ekwh-p1txKMpvW7yhlArT7A6QwkNWCoIw-xjRsM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSoobin() {
    console.log('Fetching auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error('Error fetching auth users:', authError);
    } else {
        const soobinUsers = authUsers.users.filter(u => u.email && u.email.toLowerCase().includes('soobin'));
        console.log('Auth users matching "soobin":', soobinUsers.map(u => ({ id: u.id, email: u.email })));
    }

    console.log('\nFetching public.users...');
    const { data: publicUsers, error: publicError } = await supabase.from('users').select('*');
    if (publicError) {
        console.error('Error fetching public users:', publicError);
    } else {
        const soobinPublic = publicUsers.filter(u => 
            (u.email && u.email.toLowerCase().includes('soobin')) || 
            (u.full_name && u.full_name.toLowerCase().includes('soobin'))
        );
        console.log('Public users matching "soobin":', soobinPublic.map(u => ({ id: u.id, email: u.email, full_name: u.full_name })));
    }
}

checkSoobin();
