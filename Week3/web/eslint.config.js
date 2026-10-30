import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

// Flat config (ESLint 9) for a React + Vite app using the automatic JSX runtime.
export default [
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        document: "readonly",
        window: "readonly",
        requestAnimationFrame: "readonly",
        fetch: "readonly",
      },
    },
    settings: { react: { version: "detect" } },
    rules: {
      // jsx-uses-vars marks components referenced in JSX as "used".
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "off", // automatic runtime: no React import needed
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "warn",
    },
  },
];
