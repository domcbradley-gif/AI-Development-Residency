# Week 3 — Community-Governed Data (slice 1)

A thin, end-to-end slice of the accountability app. It stands up the **three-tier
skeleton** and delivers the first piece of Week 3's *"resident capture & the
record"*: a resident submits an **anonymous text contribution** about their
housing, it is stored, and the community record is shown back.

**Everything here is synthetic data only.** There is no code path that accepts
real resident data — the app refuses to start unless `DATA_MODE=synthetic`.

## Architecture (three tiers, portable by design)

| Tier | Tech | Folder |
|------|------|--------|
| 1 — Presentation | Vite + React + Material UI | [`web/`](web/) |
| 2 — Application | Python + FastAPI (REST/JSON) | [`api/`](api/) |
| 3 — Data | Postgres, schema/migrations in code (Alembic) | [`api/alembic/`](api/alembic/) |

The slice is portable: Postgres + standard images, no proprietary APIs, so it
can re-home to a community-controlled host later.

## Run the whole stack (recommended)

Requires Docker Desktop (Docker + Docker Compose).

```bash
cd Week3
cp .env.example .env        # local, synthetic-only credentials — never commit .env
docker compose up --build
```

Then open:

- Web client: http://localhost:5173
- API docs:   http://localhost:8000/docs

On start the API applies migrations, seeds synthetic contributions, and serves.
A contribution submitted in the UI round-trips through all three tiers and
appears in "The community record".

## Run a tier on its own (no Docker)

### API (Tier 2 + 3)

```bash
cd Week3/api
python -m venv .venv && . .venv/Scripts/activate   # Windows; use bin/activate on macOS/Linux
pip install -r requirements-dev.txt

# Point at any Postgres; or use SQLite for a quick spin:
export DATABASE_URL="postgresql+psycopg://user:pass@localhost:5432/accountability"
export DATA_MODE=synthetic
alembic upgrade head
python seed.py
uvicorn app.main:app --reload
```

### Web (Tier 1)

```bash
cd Week3/web
npm install
VITE_API_URL=http://localhost:8000 npm run dev
```

## Tests, lint, CI

```bash
# API
cd Week3/api
DATABASE_URL="sqlite+pysqlite:///:memory:" DATA_MODE=synthetic pytest
ruff check .

# Web
cd Week3/web
npm run lint
npm run build
```

CI (GitHub Actions, `.github/workflows/ci.yml`) runs all of the above on every
push and PR. The API tests run against in-memory SQLite, so CI needs no database.

## Safety rails baked into slice 1

- **Anonymity by default** — the `contributions` table has no identifying columns
  (no resident id, name, email, IP, or session). The API never reads or logs the
  client IP. `tests/test_anonymity.py` fails if an identifying column is added.
- **Synthetic-only, enforced in code** — `app/synthetic.py` refuses to start the
  app for any `DATA_MODE` other than `synthetic`. No real-data path exists.
- **Externalized, provisional config** — community-owned values (topic allowlist,
  body limit, aggregation threshold) live in `app/config.py`, each labeled
  *"provisional — not set by the community."* The UI shows that label.
- **Input validation at the trust boundary** — the API validates every field,
  uses an allowlist for `topic`, rejects unknown fields (so a client can't smuggle
  in an identifying field), and uses parameterized queries via SQLAlchemy.
- **Secrets as env vars only** — no secret is committed; see `.env.example`.
- **Accessibility (WCAG 2.2 AA)** — semantic HTML, labelled controls, a skip link,
  visible keyboard focus, live-region announcements for results, AA-contrast
  colors, and `prefers-reduced-motion` honored.

## Deferred to later slices (on the backlog)

Audio/video capture · resident export & delete · official-record ingestion &
the reported-vs-lived gap · the independent community body · warrant issuance /
revocation · provider onboarding & funding discipline · free-host deployment &
object storage (R2/MinIO).
