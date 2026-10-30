"""Request/response validation schemas (the trust boundary).

All input from the web client is untrusted and is validated here on the server,
regardless of any client-side checks (those are for UX only). We validate type,
length, and format, and use an allowlist for `topic`. Extra/unknown fields are
rejected so a client cannot sneak in an identifying field. See the
input-validation skill.
"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator

from .config import PROVISIONAL_MAX_BODY_LENGTH, PROVISIONAL_TOPIC_ALLOWLIST


class ContributionCreate(BaseModel):
    """Incoming anonymous contribution from a resident."""

    # forbid unknown fields: a client cannot attach name/email/etc.
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    body: str
    topic: str | None = None

    @field_validator("body")
    @classmethod
    def _body_nonempty_and_bounded(cls, value: str) -> str:
        if not value:
            raise ValueError("A contribution cannot be empty.")
        if len(value) > PROVISIONAL_MAX_BODY_LENGTH:
            raise ValueError(
                f"A contribution must be at most {PROVISIONAL_MAX_BODY_LENGTH} "
                "characters."
            )
        return value

    @field_validator("topic")
    @classmethod
    def _topic_in_allowlist(cls, value: str | None) -> str | None:
        if value is None or value == "":
            return None
        if value not in PROVISIONAL_TOPIC_ALLOWLIST:
            # Allowlist, not blocklist: only known-good topics are accepted.
            raise ValueError("Unknown topic.")
        return value


class ContributionOut(BaseModel):
    """What we return to the client. Mirrors the anonymous stored record."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    body: str
    topic: str | None
    created_at: datetime
    is_synthetic: bool
