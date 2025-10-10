"""Flask application factory."""
from __future__ import annotations

from pathlib import Path

from flask import Flask
from flask_cors import CORS

from .database import db, migrate
from .settings import Settings


def create_app(settings: Settings | None = None) -> Flask:
    """Create and configure the Flask application instance."""
    config = settings or Settings()

    app = Flask(__name__)
    app.config.update(
        SQLALCHEMY_DATABASE_URI=config.database_url,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        UPLOAD_FOLDER=str(config.upload_folder),
        IMAGE_FOLDER=str(config.image_folder),
        MAX_CONTENT_LENGTH=config.max_upload_size,
        JSON_SORT_KEYS=False,
    )

    # Ensure storage directories exist.
    Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)
    Path(app.config["IMAGE_FOLDER"]).mkdir(parents=True, exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)

    CORS(app, resources={r"/api/*": {"origins": config.cors_origins}})

    from .api.routes import api_bp

    app.register_blueprint(api_bp, url_prefix="/api")

    return app
