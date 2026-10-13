---
name: input-validation
description: Validates and sanitizes untrusted input to prevent injection and bad data. Use when handling form input, request bodies, query params, file uploads, or any data crossing a trust boundary.
---

Treat all input from users, clients, or external systems as untrusted.

1. Validate on the server (application tier) even if the client already validated — client checks are for UX, not security.
2. Check type, length, format, and range. Prefer allowlists (what IS permitted) over blocklists (what isn't).
3. Prevent SQL injection: use parameterized queries / prepared statements only. Never build SQL by concatenating strings.
4. Prevent XSS: encode/escape output for its context (HTML, attribute, JS) rather than trusting stored input.
5. For file uploads: check type and size, and never trust the filename.
6. Reject invalid input with a clear, specific error — but never echo back sensitive internals in the message.
7. Validate at every trust boundary (API edge, service-to-service), not just the UI.
