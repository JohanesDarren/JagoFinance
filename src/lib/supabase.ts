import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    supabaseUrl.trim() !== '' &&
    supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL' &&
    supabaseUrl !== 'YOUR_SUPABASE_URL' &&
    supabaseAnonKey.trim() !== '' &&
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
  );
};

if (!isSupabaseConfigured()) {
  console.warn(
    'Supabase is not configured properly. Please check your .env.local file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);
