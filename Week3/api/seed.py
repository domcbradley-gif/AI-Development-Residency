"""Seed the data tier with SYNTHETIC contributions only.

Run after migrations. Every row is fabricated for development and is clearly
marked synthetic. No real resident data, ever, this phase.

Usage (inside the api container, or locally with DATABASE_URL set):
    python seed.py
"""

from __future__ import annotations

from app.db import SessionLocal
from app.models import Contribution
from app.synthetic import enforce_synthetic_only

# Fabricated examples, echoing the kinds of issues named in the manifesto.
SYNTHETIC_CONTRIBUTIONS: list[dict[str, str]] = [
    {
        "body": "Black mold has been creeping down the bedroom wall for three months. "
        "I've reported it twice and nothing has changed.",
        "topic": "mold",
    },
    {
        "body": "The elevator has been out for two weeks. I'm on the 6th floor and "
        "can barely manage the stairs.",
        "topic": "elevator",
    },
    {
        "body": "Roaches everywhere in the kitchen. Management says it's my fault for "
        "leaving food out, but the whole building has them.",
        "topic": "pests",
    },
    {
        "body": "No heat since the cold snap started. We've been using the oven to "
        "stay warm, which I know isn't safe.",
        "topic": "heating",
    },
]


def main() -> None:
    enforce_synthetic_only()
    session = SessionLocal()
    try:
        existing = session.query(Contribution).count()
        if existing:
            print(f"Seed skipped: {existing} contribution(s) already present.")
            return
        session.add_all(
            Contribution(body=row["body"], topic=row["topic"], is_synthetic=True)
            for row in SYNTHETIC_CONTRIBUTIONS
        )
        session.commit()
        print(f"Seeded {len(SYNTHETIC_CONTRIBUTIONS)} synthetic contributions.")
    finally:
        session.close()


if __name__ == "__main__":
    main()
