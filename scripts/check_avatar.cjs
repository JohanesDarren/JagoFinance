const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jvptuknzpgadkhyvoxzc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cHR1a256cGdhZGtoeXZveHpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM3MDE0OCwiZXhwIjoyMDk3OTQ2MTQ4fQ.qru2Ekwh-p1txKMpvW7yhlArT7A6QwkNWCoIw-xjRsM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data, error } = await supabase.from('users').select('avatar_url').limit(1);
    if (error) {
        console.log("Error selecting avatar_url:", error.message);
    } else {
        console.log("avatar_url exists!");
    }
}
main();
