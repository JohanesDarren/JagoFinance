import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvptuknzpgadkhyvoxzc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cHR1a256cGdhZGtoeXZveHpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM3MDE0OCwiZXhwIjoyMDk3OTQ2MTQ4fQ.qru2Ekwh-p1txKMpvW7yhlArT7A6QwkNWCoIw-xjRsM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    // using postgres rest api to query schema is blocked on auth schema.
    // we can use a raw sql function if it exists, or just do it via CLI!
}

check();
