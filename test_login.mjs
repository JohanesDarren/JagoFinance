import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvptuknzpgadkhyvoxzc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cHR1a256cGdhZGtoeXZveHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNzAxNDgsImV4cCI6MjA5Nzk0NjE0OH0.YptXwSLBzrlchv31fjXDRosFoWhghe0corHM6TMxB8k';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'karyawan@jagofinance.com',
        password: 'password'
    });
    if (error) {
        console.error('Error logging in:');
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log('Login successful:', data.user?.id);
    }
}

testLogin();
