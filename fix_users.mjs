import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvptuknzpgadkhyvoxzc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cHR1a256cGdhZGtoeXZveHpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM3MDE0OCwiZXhwIjoyMDk3OTQ2MTQ4fQ.qru2Ekwh-p1txKMpvW7yhlArT7A6QwkNWCoIw-xjRsM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUsers() {
    const usersToCreate = [
        { email: 'superadmin@jagofinance.com', password: 'password', role: 'super_admin', full_name: 'Budi Superadmin' },
        { email: 'admincabang@jagofinance.com', password: 'password', role: 'admin_corp', full_name: 'Siti Admin Corp' },
        { email: 'karyawan@jagofinance.com', password: 'password', role: 'karyawan', full_name: 'Andi Karyawan' }
    ];

    const companyId = '00000000-0000-0000-0000-000000000001';
    const branchId = '00000000-0000-0000-0000-000000000002';

    for (const u of usersToCreate) {
        // 1. Delete if exists (we can find by email first)
        const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
            console.error('List error:', listError);
            return;
        }
        const existing = usersData.users.find(x => x.email === u.email);
        if (existing) {
            console.log(`Deleting existing user ${u.email}...`);
            await supabase.auth.admin.deleteUser(existing.id);
            // Delete from public.users as well just in case ON DELETE CASCADE didn't fire due to some reason
            await supabase.from('users').delete().eq('id', existing.id);
        }

        // 2. Create properly via Admin API
        console.log(`Creating user ${u.email}...`);
        const { data, error } = await supabase.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true
        });

        if (error) {
            console.error(`Error creating ${u.email}:`, error);
            continue;
        }

        const newId = data.user.id;
        console.log(`Created with ID: ${newId}. Inserting to public.users...`);

        // 3. Insert into public.users
        const { error: insertError } = await supabase.from('users').insert({
            id: newId,
            company_id: companyId,
            branch_id: branchId,
            role: u.role,
            full_name: u.full_name,
            email: u.email
        });

        if (insertError) {
            console.error(`Error inserting profile for ${u.email}:`, insertError);
        } else {
            console.log(`Successfully fixed ${u.email}`);
        }
    }
}

fixUsers();
