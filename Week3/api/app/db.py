"""Database engine and session wiring (Tier 3 access from Tier 2).

The connection string is read from the environment (DATABASE_URL) — never
hardcoded. Postgres + SQLAlchemy keeps the data tier portable (no proprietary
APIs), so it can re-home to a community-controlled host later.
"""

from __future__ import annotations

from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import settings


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""


def _make_engine():
    url = settings.database_url
    if not url:
        raise RuntimeError(
            "DATABASE_URL is not set. Provide it via the environment "
            "(docker-compose injects it from the project .env file)."
        )
    # pool_pre_ping avoids stale connections when the db container restarts.
    return create_engine(url, pool_pre_ping=True, future=True)


engine = _make_engine()
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_session() -> Iterator[Session]:
    """FastAPI dependency that yields a scoped session and always closes it."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
