# Database diagram — MVP #1

The rendered diagram (with a key) is **[`database-diagram.svg`](database-diagram.svg)**:

![Database design diagram](database-diagram.svg)

All tables live in Supabase (Postgres). Every table has Row Level Security
enabled, and all data is synthetic only (insert policies reject non-synthetic
rows). The Mermaid source below mirrors the SVG.

```mermaid
erDiagram
    auth_users ||--o| profiles : "has"
    auth_users ||--o{ memberships : "joins via"
    auth_users ||--o{ warrants : "issues / revokes"
    providers ||--o{ official_records : "has"
    providers ||--o{ community_bodies : "overseen by"
    providers ||--o{ warrants : "subject of"
    community_bodies ||--o{ memberships : "has"
    community_bodies ||--o{ warrants : "issues"
    warrants ||--o{ warrant_events : "logs"

    contributions {
        uuid id PK
        text body
        text topic "nullable"
        timestamptz created_at
        bool synthetic
    }
    auth_users {
        uuid id PK "Supabase auth"
        text email
    }
    profiles {
        uuid id PK "FK to auth.users"
        user_role role
        text display_name "nullable"
        timestamptz created_at
    }
    providers {
        uuid id PK
        text name
        text description "nullable"
        bool synthetic
        timestamptz created_at
    }
    official_records {
        uuid id PK
        uuid provider_id FK
        text source
        text category
        text reported_summary
        date record_date "nullable"
        bool synthetic
        timestamptz created_at
    }
    community_bodies {
        uuid id PK
        text name
        uuid provider_id FK "nullable"
        int4 quorum
        bool synthetic
        timestamptz created_at
    }
    memberships {
        uuid id PK
        uuid body_id FK
        uuid user_id FK
        timestamptz joined_at
    }
    warrants {
        uuid id PK
        uuid provider_id FK
        uuid body_id FK
        text status
        text reason "nullable"
        uuid issued_by FK
        timestamptz issued_at
        uuid revoked_by FK "nullable"
        timestamptz revoked_at "nullable"
        bool synthetic
        timestamptz created_at
    }
    warrant_events {
        uuid id PK
        uuid warrant_id FK
        text event_type
        uuid actor FK "nullable"
        text note "nullable"
        timestamptz created_at
    }
    funding_sources {
        uuid id PK
        text name
        numeric amount
        bool from_watched
        bool synthetic
        timestamptz created_at
    }
    conflict_register {
        uuid id PK
        text description
        timestamptz disclosed_at
        bool synthetic
    }
```

## Notes

- **contributions** is intentionally unlinked to any user — anonymity by default
  (see ADR 0004). Public-read; inserts allowed only when `synthetic = true`.
- **funding_sources** and **conflict_register** also stand alone (public-read).
- **profiles / memberships** carry identity and are scoped by RLS (own row / self
  only). `memberships` enforces self-organized joining: a user may add or remove
  only themselves.
- **warrants** is a public register; insert/update is allowed only to members of
  the issuing body. **warrant_events** is an append-only audit trail (the receipt).
- **official_records** inserts are restricted to provider-role users (see ADR 0007).
- `auth_users` is Supabase's built-in `auth.users`; shown for relationships only.

Key / notation: `PK` primary key · `FK` foreign key · `nullable` may be empty ·
a crow's-foot (fork) on a relationship line means "many".
