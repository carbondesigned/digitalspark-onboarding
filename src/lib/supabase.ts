import {createClient} from '@supabase/supabase-js';

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_KEY;
const SUPABASE_URL = 'https://nhdcwxygnkwkfcsjeogu.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZGN3eHlnbmt3a2Zjc2plb2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc4MTA2NzYsImV4cCI6MjAwMzM4NjY3Nn0.CsFcgY11XrPTvTYB44mRhTW0VU4S4USroSQMQFZWtdA';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing env variables for Supabase');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
