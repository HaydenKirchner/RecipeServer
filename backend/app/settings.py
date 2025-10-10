"""Application settings."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable


@dataclass
class Settings:
    """Runtime configuration for the Flask app."""

    base_dir: Path = field(default_factory=lambda: Path(__file__).resolve().parents[1])
    database_url: str = field(init=False)
    upload_folder: Path = field(init=False)
    image_folder: Path = field(init=False)
    max_upload_size: int = 16 * 1024 * 1024  # 16 MB
    cors_origins: Iterable[str] = ("*",)

    def __post_init__(self) -> None:
        self.database_url = f"sqlite:///{self.base_dir / 'instance' / 'recipes.db'}"
        self.upload_folder = self.base_dir / "uploads"
        self.image_folder = self.base_dir / "images"
        (self.base_dir / "instance").mkdir(parents=True, exist_ok=True)
