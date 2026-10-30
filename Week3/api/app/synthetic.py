"""Synthetic-data discipline, enforced in code.

Real resident data is a no-go gate for this entire phase. Rather than relying on
intent, the app refuses to start unless DATA_MODE == "synthetic". There is no
branch anywhere that accepts, stores, or routes real data — this is the single
gate that guarantees it.
"""

from __future__ import annotations

from .config import settings

SYNTHETIC_MODE = "synthetic"


class RealDataPathError(RuntimeError):
    """Raised when the app is configured for anything other than synthetic data."""


def enforce_synthetic_only() -> None:
    """Fail fast unless the app is running in synthetic-only mode.

    Called at startup. Keeps the guarantee from the build plan: "no real-data
    path exists" until the Tier-1 community decisions and consent model are
    ratified.
    """
    if settings.data_mode != SYNTHETIC_MODE:
        raise RealDataPathError(
            "This phase is synthetic-data only. Set DATA_MODE=synthetic. "
            "No real-data path exists in this code until the community's "
            "consent model is ratified."
        )
