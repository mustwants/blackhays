// checkSupabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

try {
  const { data, error } = await supabase.from('test_table').select('*').limit(1);
  if (error) throw error;
  console.log("✅ Supabase is responsive. Starting preview...");
  const { exec } = await import('child_process');
  exec('npm run preview');
} catch (err) {
  console.error("❌ Supabase check failed:", err.message);
  process.exit(1);
}
