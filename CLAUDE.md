# AI Development Residency — project guide

## Using skills (always)
Before implementing or reviewing anything, check the skills in `.claude/skills/`
and apply every skill whose description fits the task. In particular:

- **secrets-management** — anything touching credentials, config, or environment variables
- **input-validation** — any handling of user input or data crossing a trust boundary
- **a11y-wcag** — any UI, component, form, page, or styling
- **commit-msg** — when writing a commit message

After completing a task, state which skill(s) you applied and the specific
guidance you followed. If no skill applied, say so explicitly.

## Standards
This is a three-tier project aiming for enterprise-ready software.
Treat security and accessibility as first-class concerns, not afterthoughts.
