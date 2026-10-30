"""The synthetic-only gate must actually block non-synthetic modes."""

from __future__ import annotations

import pytest

from app import config, synthetic
from app.synthetic import RealDataPathError, enforce_synthetic_only


def test_synthetic_mode_is_allowed(monkeypatch):
    monkeypatch.setattr(config.settings, "data_mode", "synthetic")
    # Should not raise.
    enforce_synthetic_only()


def test_non_synthetic_mode_is_rejected(monkeypatch):
    monkeypatch.setattr(config.settings, "data_mode", "production")
    with pytest.raises(RealDataPathError):
        enforce_synthetic_only()


def test_real_looking_mode_is_rejected(monkeypatch):
    monkeypatch.setattr(config.settings, "data_mode", "real")
    with pytest.raises(RealDataPathError):
        synthetic.enforce_synthetic_only()
