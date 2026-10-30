"""Anonymity rail: the stored record must not be traceable to an individual.

This is a safety rail, not a feature. If someone adds an identifying column to
the contributions table, these tests fail.
"""

from __future__ import annotations

from app.models import FORBIDDEN_IDENTITY_COLUMNS, Contribution


def test_contributions_table_has_no_identity_columns():
    columns = set(Contribution.__table__.columns.keys())
    leaked = columns & FORBIDDEN_IDENTITY_COLUMNS
    assert not leaked, f"Identifying column(s) present on an anonymous table: {leaked}"


def test_stored_contribution_response_contains_no_identity_fields(client):
    client.post("/contributions", json={"body": "a synthetic note", "topic": "mold"})
    rows = client.get("/contributions").json()
    assert rows, "expected at least one stored contribution"
    for row in rows:
        assert not (set(row.keys()) & FORBIDDEN_IDENTITY_COLUMNS)
