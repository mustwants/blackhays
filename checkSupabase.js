// checkSupabase.js
// Verifies that required tables and columns exist before starting the app
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const tables = {
  newsletter_subscribers: ['email', 'first_name', 'last_name', 'status', 'notify_ceo'],
  events: ['name', 'start_date', 'end_date', 'location'],
  event_submissions: ['name', 'start_date', 'end_date', 'location', 'status', 'submitter_email'],
  advisor_applications: ['first_name', 'last_name', 'email', 'state', 'zip_code', 'status'],
  company_submissions: ['name', 'website', 'status', 'submitter_email'],
  consortium_submissions: ['name', 'website', 'status', 'submitter_email'],
  innovation_submissions: ['name', 'website', 'status', 'submitter_email']
};

try {
  for (const [table, columns] of Object.entries(tables)) {
    const { error } = await supabase.from(table).select(columns.join(',')).limit(1);
    if (error) throw new Error(`${table}: ${error.message}`);
    console.log(`✅ ${table} table and required fields are present`);
  }

  console.log('✅ Supabase is responsive. Starting preview...');
  const { exec } = await import('child_process');
  exec('npm run preview');
} catch (err) {
  console.error('❌ Supabase check failed:', err.message);
  process.exit(1);
}
