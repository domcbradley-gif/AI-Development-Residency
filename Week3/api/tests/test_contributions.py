"""End-to-end (through the API) behavior and input validation for slice 1."""

from __future__ import annotations

from app.config import PROVISIONAL_MAX_BODY_LENGTH


def test_round_trip_create_then_list(client):
    resp = client.post(
        "/contributions", json={"body": "no heat for two weeks", "topic": "heating"}
    )
    assert resp.status_code == 201
    created = resp.json()
    assert created["body"] == "no heat for two weeks"
    assert created["topic"] == "heating"
    assert created["is_synthetic"] is True
    assert created["id"]

    listed = client.get("/contributions")
    assert listed.status_code == 200
    bodies = [c["body"] for c in listed.json()]
    assert "no heat for two weeks" in bodies


def test_body_is_required(client):
    assert client.post("/contributions", json={"body": ""}).status_code == 422
    assert client.post("/contributions", json={"body": "   "}).status_code == 422
    assert client.post("/contributions", json={}).status_code == 422


def test_body_length_is_bounded(client):
    too_long = "x" * (PROVISIONAL_MAX_BODY_LENGTH + 1)
    assert client.post("/contributions", json={"body": too_long}).status_code == 422


def test_topic_must_be_in_allowlist(client):
    resp = client.post(
        "/contributions", json={"body": "valid body", "topic": "not-a-real-topic"}
    )
    assert resp.status_code == 422


def test_topic_is_optional(client):
    resp = client.post("/contributions", json={"body": "valid body with no topic"})
    assert resp.status_code == 201
    assert resp.json()["topic"] is None


def test_unknown_fields_are_rejected(client):
    # A client must not be able to smuggle in an identifying field.
    resp = client.post(
        "/contributions",
        json={"body": "valid", "email": "someone@example.com"},
    )
    assert resp.status_code == 422


def test_body_whitespace_is_trimmed(client):
    resp = client.post("/contributions", json={"body": "  spaced out  "})
    assert resp.status_code == 201
    assert resp.json()["body"] == "spaced out"
