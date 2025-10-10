"""Utilities for extracting recipe data from PDF documents."""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import pdfplumber
from pdf2image import convert_from_path

from ..version import __version__  # keep import for potential version-specific extraction tweaks


INGREDIENT_PATTERN = re.compile(r"^[-\u2022\*\d\.\)\s]*(.+?)\s*(?:\d+\s*(?:oz|cups?|tsp|tbsp|lb)s?)?\s*$", re.IGNORECASE)
PROTEIN_KEYWORDS = {
    "chicken": "Chicken",
    "beef": "Beef",
    "pork": "Pork",
    "salmon": "Salmon",
    "tilapia": "Tilapia",
    "shrimp": "Shrimp",
    "tofu": "Tofu",
    "beans": "Beans",
    "lentil": "Lentils",
    "turkey": "Turkey",
    "cod": "Cod",
    "tuna": "Tuna",
    "egg": "Egg",
    "chickpea": "Chickpeas",
}


@dataclass
class ExtractedRecipe:
    name: str
    protein: str | None
    ingredients: list[str]
    image_filename: str | None
    servings: int = 2

    def to_dict(self) -> dict[str, object]:
        return {
            "name": self.name,
            "protein": self.protein,
            "ingredients": self.ingredients,
            "image": f"/api/images/{self.image_filename}" if self.image_filename else None,
            "servings": self.servings,
        }


def extract_recipe_from_pdf(pdf_path: Path, image_dir: Path) -> ExtractedRecipe:
    """Extract structured recipe data from a PDF file."""
    text_lines = _extract_text_lines(pdf_path)
    name = _extract_recipe_name(text_lines)
    ingredients = _extract_ingredients(text_lines)
    protein = _detect_protein(text_lines)
    image_filename = _extract_image(pdf_path, image_dir)
    return ExtractedRecipe(name=name, protein=protein, ingredients=ingredients, image_filename=image_filename)


def _extract_text_lines(pdf_path: Path) -> list[str]:
    with pdfplumber.open(pdf_path) as pdf:
        lines: list[str] = []
        for page in pdf.pages:
            raw_text = page.extract_text() or ""
            for line in raw_text.splitlines():
                cleaned = line.strip()
                if cleaned:
                    lines.append(cleaned)
        return lines


def _extract_recipe_name(lines: Iterable[str]) -> str:
    for line in lines:
        if len(line.split()) > 2:
            return line.strip().title()
    return Path("recipe").stem


def _extract_ingredients(lines: Iterable[str]) -> list[str]:
    ingredients: list[str] = []
    for line in lines:
        if "ingredients" in line.lower():
            continue
        match = INGREDIENT_PATTERN.match(line)
        if match:
            candidate = match.group(1).strip()
            if 2 <= len(candidate.split()) <= 8:
                ingredients.append(candidate.title())
    return sorted(set(ingredients))


def _detect_protein(lines: Iterable[str]) -> str | None:
    joined = " ".join(lines).lower()
    for keyword, protein in PROTEIN_KEYWORDS.items():
        if keyword in joined:
            return protein
    return None


def _extract_image(pdf_path: Path, image_dir: Path) -> str | None:
    try:
        images = convert_from_path(str(pdf_path), first_page=1, last_page=1)
    except Exception:  # pragma: no cover - pdf2image may require poppler during runtime tests
        return None

    if not images:
        return None

    image = images[0]
    image_dir.mkdir(parents=True, exist_ok=True)
    filename = pdf_path.with_suffix(".jpg").name
    output_path = image_dir / filename
    image.save(output_path, "JPEG")
    return filename
