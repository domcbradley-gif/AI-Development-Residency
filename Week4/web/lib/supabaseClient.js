"use client";

// Supabase browser client (for the anonymous contribution flow).
//
// The URL and the ANON (publishable) key are PUBLIC by design: the anon key is
// meant to ship in the browser and is gated by Row Level Security on the server.
// NEVER expose the service_role key here — it bypasses RLS. Real values are set
// as Vercel project env vars and in a local, git-ignored .env.local.
//
// The client is created LAZILY (on first use) rather than at module load, so a
// production `next build` never requires the env to be present just to compile.

import { createBrowserClient } from "@supabase/ssr";

let client;

export function getSupabaseBrowserClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Fail loudly and clearly at call time rather than making confusing,
    // half-working calls — but only when actually used, not at build.
    throw new Error(
      "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example).",
    );
  }

  client = createBrowserClient(url, anonKey);
  return client;
}
