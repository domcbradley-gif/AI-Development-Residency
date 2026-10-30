"""FastAPI application — Tier 2 (application & business logic).

Exposes a minimal REST/JSON API for slice 1: a resident can submit an anonymous
text contribution and read the synthetic record back. The synthetic-only gate is
enforced at startup.

Role-based access, the gap computation, the community body, the warrant, and the
provider all come in later slices. By design there is no endpoint that could
expose a raw individual account, because no such account is stored.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import (
    PROVISIONAL_LABEL,
    PROVISIONAL_TOPIC_ALLOWLIST,
    settings,
)
from .db import get_session
from .models import Contribution
from .schemas import ContributionCreate, ContributionOut
from .synthetic import enforce_synthetic_only


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # No real-data path: refuse to start unless DATA_MODE=synthetic.
    enforce_synthetic_only()
    yield


app = FastAPI(
    title="Community-Governed Data — Accountability API",
    summary="Synthetic-data-only API for anonymous resident contributions (slice 1).",
    version="0.1.0",
    lifespan=lifespan,
)


# The web client is a separate origin in dev; allow only the configured one.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.web_origin],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health() -> dict[str, str]:
    """Liveness probe; also reports the enforced data mode."""
    return {"status": "ok", "data_mode": settings.data_mode}


@app.get("/config/provisional")
def provisional_config() -> dict[str, object]:
    """Expose the provisional, community-owned values so the UI can label them."""
    return {
        "label": PROVISIONAL_LABEL,
        "topics": list(PROVISIONAL_TOPIC_ALLOWLIST),
    }


@app.post(
    "/contributions",
    response_model=ContributionOut,
    status_code=status.HTTP_201_CREATED,
)
def create_contribution(
    payload: ContributionCreate,
    session: Session = Depends(get_session),
) -> Contribution:
    """Store a validated, anonymous, synthetic contribution.

    We deliberately do not read or log the client IP, user-agent, or any session
    identifier: the record must not be traceable to an individual.
    """
    contribution = Contribution(
        body=payload.body,
        topic=payload.topic,
        is_synthetic=True,
    )
    session.add(contribution)
    session.commit()
    session.refresh(contribution)
    return contribution


@app.get("/contributions", response_model=list[ContributionOut])
def list_contributions(
    session: Session = Depends(get_session),
) -> list[Contribution]:
    """List synthetic contributions, newest first (slice 1 view-back)."""
    stmt = select(Contribution).order_by(Contribution.created_at.desc())
    return list(session.scalars(stmt).all())
