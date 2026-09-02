import { createClient } from '@supabase/supabase-js';

// Server-only: never import this module into browser components.
export function getDatabase() {
  if (typeof window !== 'undefined') throw new Error('Server-only database client');
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Database connection is not configured');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
