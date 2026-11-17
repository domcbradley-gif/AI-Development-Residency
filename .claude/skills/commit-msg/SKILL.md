---
name: commit-msg
description: Writes a clear git commit message from the staged changes. Use when the user asks for a commit message.
---

1. Run `git diff --staged` to see what changed.
2. Write a one-line summary under 72 characters, in the form: type: short description (e.g. "fix: handle empty login form").
3. Add a short explanation on the lines below only if the change isn't obvious.
