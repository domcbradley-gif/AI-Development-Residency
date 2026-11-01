import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Supabase client for Server Components / Server Actions / Route Handlers.
// Reads the cookie-based auth session so server code runs as the signed-in user
// (RLS applies accordingly); for public reads it acts as the anon role.
//
// Returns null when config is absent (e.g. a build without secrets) instead of
// throwing, so a production build never depends on secrets being present.
// Callers treat null as "no session / no data". At runtime on Vercel the env is
// set, so this null path is only hit in a config-less build.
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const cookieStore = cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
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
