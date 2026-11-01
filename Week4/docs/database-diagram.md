# Database diagram — MVP #1

All tables live in Supabase (Postgres). Every table has Row Level Security
enabled. Data is synthetic only; insert policies reject non-synthetic rows.

```mermaid
erDiagram
    auth_users ||--o| profiles : "has"
    auth_users ||--o{ memberships : "joins"
    auth_users ||--o{ warrants : "issues / revokes"
    providers ||--o{ official_records : "has"
    providers ||--o{ warrants : "is subject of"
    community_bodies ||--o{ memberships : "has"
    community_bodies ||--o{ warrants : "issues"
    warrants ||--o{ warrant_events : "logs"

    contributions {
        uuid id PK
        text body
        text topic "nullable; provisional allowlist (client)"
        timestamptz created_at
        boolean synthetic "default true"
    }
    auth_users {
        uuid id PK "managed by Supabase Auth"
        text email
    }
    profiles {
        uuid id PK "FK -> auth.users.id"
        user_role role "community_member | provider"
        text display_name "nullable"
        timestamptz created_at
    }
    providers {
        uuid id PK
        text name
        text description "nullable"
        boolean synthetic "default true"
        timestamptz created_at
    }
    official_records {
        uuid id PK
        uuid provider_id FK
        text source
        text category "lines up with contribution topic"
        text reported_summary
        date record_date "nullable"
        boolean synthetic "default true"
        timestamptz created_at
    }
    community_bodies {
        uuid id PK
        text name
        uuid provider_id FK "nullable"
        integer quorum "provisional"
        boolean synthetic "default true"
        timestamptz created_at
    }
    memberships {
        uuid id PK
        uuid body_id FK
        uuid user_id FK "-> auth.users.id"
        timestamptz joined_at
    }
    warrants {
        uuid id PK
        uuid provider_id FK
        uuid body_id FK
        text status "issued | revoked"
        text reason "nullable"
        uuid issued_by FK "-> auth.users.id"
        timestamptz issued_at
        uuid revoked_by FK "nullable"
        timestamptz revoked_at "nullable"
        boolean synthetic "default true"
        timestamptz created_at
    }
    warrant_events {
        uuid id PK
        uuid warrant_id FK
        text event_type "issued | revoked"
        uuid actor FK "-> auth.users.id, nullable"
        text note "nullable"
        timestamptz created_at
    }
```

## Notes

- **contributions** is intentionally unlinked to any user — anonymity by default
  (see ADR 0004). It is public-read; inserts allowed only when `synthetic = true`.
- **profiles / memberships** carry identity and are scoped by RLS (own row / self
  only). `memberships` enforces self-organized joining: a user may add or remove
  only themselves.
- **warrants** is a public register (anyone may read); insert/update is allowed
  only to members of the issuing body, as themselves.
- **warrant_events** is an append-only audit trail (the "receipt") of issue /
  revoke actions.
- `auth_users` is Supabase's built-in `auth.users`; shown here for relationships
  only (not created by our migrations).
