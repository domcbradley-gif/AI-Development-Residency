import { defineConfig } from "vitest/config";

// The logic under test (anonymity rails / contribution shaping) is pure, so a
// Node environment is enough — no DOM, no network, no Supabase env required.
export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.{js,jsx}"],
  },
});
