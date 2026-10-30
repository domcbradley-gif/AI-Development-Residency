"""ORM models (Tier 3 schema, defined in code).

ANONYMITY BY DEFAULT — READ BEFORE ADDING A COLUMN.
A contribution carries NO identifying data and cannot be traced to an
individual. There is deliberately no resident_id, no name, no email, no IP
address, and no device/session identifier on this table. The schema is minimal;
every extra field must be opt-in and reviewed against the anonymity rail before
it is added. The anonymity test in tests/ asserts this invariant and will fail
if an identifying column is introduced.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


def _utcnow() -> datetime:
    return datetime.now(UTC)


# Columns that would make a contribution traceable to a person. The anonymity
# test asserts none of these ever appear on an anonymous table.
FORBIDDEN_IDENTITY_COLUMNS: frozenset[str] = frozenset(
    {
        "resident_id",
        "user_id",
        "name",
        "full_name",
        "email",
        "phone",
        "address",
        "ip",
        "ip_address",
        "device_id",
        "session_id",
    }
)


class Contribution(Base):
    """A single anonymous, synthetic resident contribution (text only, slice 1)."""

    __tablename__ = "contributions"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    # The resident's own words about their housing. No identity is attached.
    body: Mapped[str] = mapped_column(Text, nullable=False)
    # Optional non-identifying topic tag, constrained to a provisional allowlist
    # at the application edge (see schemas.py).
    topic: Mapped[str | None] = mapped_column(String(32), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )
    # Every row in this phase is synthetic. Stored explicitly so the guarantee
    # is visible in the data, not just the code.
    is_synthetic: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True
    )
