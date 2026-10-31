// Supabase client (Tier 2 + Tier 3 now live in Supabase).
//
// The URL and the ANON (publishable) key are read from environment variables and
// are safe to ship in the browser bundle — the anon key is designed to be public
// and is gated by Row Level Security on the server. NEVER put the Supabase
// service_role key in this app; it bypasses RLS. Real values are set as Vercel
// project env vars and in a local, git-ignored web/.env (see .env.example).

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail loudly and early rather than making confusing, half-working calls.
  throw new Error(
    "Missing Supabase configuration. Set VITE_SUPABASE_URL and " +
      "VITE_SUPABASE_ANON_KEY (see web/.env.example).",
  );
}

export const supabase = createClient(url, anonKey, {
  // Anonymous, no sign-in: don't persist or refresh any auth session.
  auth: { persistSession: false, autoRefreshToken: false },
});
