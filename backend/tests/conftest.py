from __future__ import annotations

from pathlib import Path
from typing import Generator

import sys

import pytest

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.app import create_app
from backend.app.database import db
from backend.app.settings import Settings


@pytest.fixture()
def app(tmp_path: Path) -> Generator:
    """Create a Flask app instance for testing with an isolated SQLite DB."""
    settings = Settings(base_dir=tmp_path)
    application = create_app(settings)

    with application.app_context():
        db.create_all()
        yield application
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):  # type: ignore[override]
    return app.test_client()
