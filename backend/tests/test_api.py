from __future__ import annotations
from backend.app.database import db
from backend.app.models import MealPlan, Recipe


def test_upload_manual_recipe(client, app):
    payload = {
        "name": "Herbed Chicken",
        "ingredients": ["Chicken Breast", "Garlic Herb Butter", "Green Beans"],
        "protein": "Chicken",
        "servings": 2,
    }
    response = client.post("/api/upload", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data["name"] == "Herbed Chicken"

    with app.app_context():
        stored = Recipe.query.one()
        assert stored.name == "Herbed Chicken"
        assert stored.ingredients == payload["ingredients"]
        assert stored.protein == "Chicken"


def test_meal_plan_and_shopping_list_flow(client, app):
    # Seed a recipe directly in the database.
    with app.app_context():
        recipe = Recipe(
            name="Garlic Shrimp Pasta",
            protein="Shrimp",
            ingredients=["Shrimp", "Spaghetti", "Garlic", "Lemon"],
            servings=2,
        )
        db.session.add(recipe)
        db.session.commit()
        recipe_id = recipe.id

    payload = {
        "recipes": [{"recipe_id": recipe_id, "servings": 4}],
        "servings": 4,
        "title": "Weekend Plan",
    }
    save_response = client.post("/api/meal-plan", json=payload)
    assert save_response.status_code == 201

    shopping_response = client.get("/api/shopping-list")
    assert shopping_response.status_code == 200
    data = shopping_response.get_json()

    shopping_list = data["shopping_list"]
    assert "Protein" in shopping_list
    assert any(item.startswith("Shrimp (x2.0)") for item in shopping_list["Protein"])
    assert any(item.startswith("Garlic") for item in shopping_list["Produce"])

    with app.app_context():
        plan = MealPlan.query.one()
        assert plan.title == "Weekend Plan"
        assert plan.servings == 4
        assert len(plan.recipes) == 1
