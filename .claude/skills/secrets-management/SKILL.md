---
name: secrets-management
description: Keeps secrets (passwords, API keys, tokens, database credentials) out of source control. Use when writing config, handling credentials, adding environment variables, or before committing code that touches secrets.
---

Follow these rules whenever the code involves a secret (password, API key, token, connection string, or any credential):

1. Never hardcode a secret in source code. Read it from an environment variable instead, e.g. `process.env.DB_PASSWORD` or `os.environ["DB_PASSWORD"]`.

2. Store real values in a `.env` file at the project root, and make sure `.env` is listed in `.gitignore` so it is never committed.

3. Maintain a committed `.env.example` with the same variable names but no real values, so others know what to provide. Example:
   DB_HOST=
   DB_USER=
   DB_PASSWORD=
   API_KEY=

4. Before committing, scan the staged diff for anything that looks like a secret (long random strings, "password", "key", "token", "secret"). If found, stop and move it to `.env`.

5. If a secret has already been committed or pushed, treat it as compromised: rotate/regenerate it immediately, then remove it from the code. Do not rely on simply deleting the line.
