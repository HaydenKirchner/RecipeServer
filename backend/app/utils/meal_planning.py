"""Utilities for consolidating shopping lists."""
from __future__ import annotations

from collections import defaultdict
from typing import Iterable

CATEGORY_KEYWORDS = {
    "Produce": ["lettuce", "spinach", "kale", "bean", "tomato", "pepper", "onion", "garlic", "herb", "broccoli", "carrot", "potato"],
    "Dairy": ["cheese", "milk", "cream", "butter", "yogurt"],
    "Protein": ["chicken", "beef", "pork", "tofu", "shrimp", "salmon", "egg", "tilapia", "turkey"],
    "Pantry": ["rice", "pasta", "couscous", "flour", "sugar", "oil", "vinegar", "salt", "pepper", "sauce", "spice", "broth"],
}
DEFAULT_CATEGORY = "Other"


def consolidate_ingredients(ingredients: Iterable[tuple[str, float]]) -> dict[str, float]:
    consolidated: dict[str, float] = defaultdict(float)
    for name, multiplier in ingredients:
        consolidated[name] += multiplier
    return dict(consolidated)


def categorize_ingredients(ingredients: dict[str, float]) -> dict[str, list[str]]:
    categorized: dict[str, list[str]] = defaultdict(list)
    for ingredient, amount in ingredients.items():
        lowered = ingredient.lower()
        category = DEFAULT_CATEGORY
        for candidate, keywords in CATEGORY_KEYWORDS.items():
            if any(keyword in lowered for keyword in keywords):
                category = candidate
                break
        if amount and amount != 1:
            entry = f"{ingredient} (x{amount:.1f})"
        else:
            entry = ingredient
        categorized[category].append(entry)

    return {category: sorted(items) for category, items in categorized.items()}
