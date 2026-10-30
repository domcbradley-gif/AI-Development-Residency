"""Externalized configuration for the application tier.

Every community-owned value lives here as config, never as a hardcoded constant
buried in logic, and is labeled "provisional — not set by the community" until a
Tier-1 community decision ratifies it. Secrets (e.g. the database URL) come from
environment variables only — never committed to source. See the
secrets-management skill.
"""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict

# --- Provisional, community-owned values -------------------------------------
# PROVISIONAL — NOT SET BY THE COMMUNITY.
# These are placeholders chosen by the solo developer so the slice runs. They
# must be ratified (or replaced) by the Tier-1 community before any real use.

# Allowlist of housing-issue topics a resident may optionally tag a contribution
# with. Kept non-identifying on purpose. "other" is the catch-all.
PROVISIONAL_TOPIC_ALLOWLIST: tuple[str, ...] = (
    "mold",
    "pests",
    "heating",
    "elevator",
    "safety",
    "repairs",
    "other",
)

# Maximum length of a free-text contribution body (characters).
PROVISIONAL_MAX_BODY_LENGTH: int = 5000

# Minimum group size before any aggregate may be shown. Not used by slice 1
# (no aggregation yet) but externalized now so it is never hardcoded later.
PROVISIONAL_AGGREGATION_MIN_GROUP_SIZE: int = 10

PROVISIONAL_LABEL: str = "provisional — not set by the community"


class Settings(BaseSettings):
    """Runtime settings read from the environment.

    Nothing here carries a real default secret. `database_url` must be supplied
    by the environment (docker-compose injects it from the project `.env`).
    """

    model_config = SettingsConfigDict(env_file=None, extra="ignore")

    # Secret / environment-provided. No default value in source.
    database_url: str = ""

    # Synthetic-data discipline: the ONLY accepted value this phase is
    # "synthetic". Any other value makes the app refuse to start, so there is
    # literally no real-data code path. See synthetic.py.
    data_mode: str = "synthetic"

    # CORS origin for the local web client. Overridable per environment.
    web_origin: str = "http://localhost:5173"


settings = Settings()
