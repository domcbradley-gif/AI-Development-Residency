"use client";

// Two browser clients, on purpose:
//  - getSupabaseBrowserClient(): auth-aware (login, membership, warrants). Carries
//    the signed-in session so RLS runs as that user.
//  - getAnonContributionsClient(): SESSION-LESS. The contribution record is
//    anonymous even for logged-in residents (they are the organizers an adversary
//    most wants to unmask), so posts/reads go through a client that never attaches
//    an account JWT — no identity at the row level (the table has none) or the
//    request/log level.
// NEVER expose the service_role key here; the anon key is public by design.

import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { ANON_CONTRIBUTIONS_AUTH } from "./anon-client-config.js";

function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example).",
    );
  }
  return { url, anonKey };
}

let client;
export function getSupabaseBrowserClient() {
  if (client) return client;
  const { url, anonKey } = env();
  client = createBrowserClient(url, anonKey);
  return client;
}

let anonClient;
export function getAnonContributionsClient() {
  if (anonClient) return anonClient;
  const { url, anonKey } = env();
  anonClient = createClient(url, anonKey, { auth: ANON_CONTRIBUTIONS_AUTH });
  return anonClient;
}
