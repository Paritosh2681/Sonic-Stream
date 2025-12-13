import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iryrtcqybkhbmzqaxpqe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyeXJ0Y3F5YmtoYm16cWF4cHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NjcwNjAsImV4cCI6MjA4MTE0MzA2MH0.bnAtsr0xgLutgkZ9hksuDhzuXO7ZdiA-Sv3PEMJAV54';

export const supabase = createClient(supabaseUrl, supabaseKey);