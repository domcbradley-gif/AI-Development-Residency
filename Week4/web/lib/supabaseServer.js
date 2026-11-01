import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Supabase client for Server Components / Server Actions / Route Handlers.
// Reads the cookie-based auth session so server-side code runs as the signed-in
// user (and RLS applies accordingly). For public, anonymous reads it simply acts
// as the anon role. Secrets: only the PUBLIC url + anon key are used here.
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example).",
    );
  }

  const cookieStore = cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // In a Server Component, cookies are read-only and setting throws; that
        // is fine — session refresh is handled in middleware / server actions.
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* no-op in read-only (Server Component) context */
        }
      },
    },
  });
}
