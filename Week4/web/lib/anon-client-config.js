// Session-less auth config for the anonymous contributions client. Kept in its
// own module so it is unit-testable (anon-posting.test.js) without importing the
// Supabase SDK. These flags ensure the contributions client NEVER persists or
// sends a user session/JWT — so anonymity holds even for a logged-in resident.
export const ANON_CONTRIBUTIONS_AUTH = Object.freeze({
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
});
