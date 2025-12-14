import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder values to prevent crash if env vars are missing
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

const isPlaceholder = supabaseUrl === 'https://example.supabase.co';

if (isPlaceholder) {
  console.warn("Supabase Environment Variables are missing. Authentication and database features will be disabled or fail.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export const isSupabaseConfigured = !isPlaceholder;