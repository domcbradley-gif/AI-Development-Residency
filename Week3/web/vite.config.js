import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server on 5173; the API origin is injected via VITE_API_URL at build/run.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
});
