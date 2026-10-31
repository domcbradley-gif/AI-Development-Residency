import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server on 5173. Supabase config (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
// is read from web/.env in dev and from Vercel env vars in production.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
});
