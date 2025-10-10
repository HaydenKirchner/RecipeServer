"""API endpoints for the recipe planner."""
from __future__ import annotations

from http import HTTPStatus
from pathlib import Path
from typing import Any

from flask import Blueprint, current_app, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename

from ..database import db
from ..models import MealPlan, MealPlanRecipe, Recipe
from ..utils.meal_planning import categorize_ingredients, consolidate_ingredients
from ..utils.pdf_processing import extract_recipe_from_pdf
from ..version import __version__

api_bp = Blueprint("api", __name__)

ALLOWED_EXTENSIONS = {"pdf"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@api_bp.route("/version", methods=["GET"])
def version() -> Any:
    return jsonify({"version": __version__})


@api_bp.route("/upload", methods=["POST"])
def upload_recipe() -> Any:
    """Accept a PDF upload or manual JSON payload and persist a recipe."""
    if request.content_type and "application/json" in request.content_type:
        payload = request.get_json(force=True)
        if not payload:
            return jsonify({"error": "Missing JSON payload."}), HTTPStatus.BAD_REQUEST
        name = payload.get("name")
        ingredients = payload.get("ingredients", [])
        protein = payload.get("protein")
        servings = payload.get("servings", 2)
        image_filename = payload.get("image_filename")
        if not name or not ingredients:
            return jsonify({"error": "Recipe name and ingredients are required."}), HTTPStatus.BAD_REQUEST
        recipe = Recipe(name=name, protein=protein, ingredients=ingredients, servings=servings, image_filename=image_filename)
        db.session.add(recipe)
        db.session.commit()
        return jsonify({"id": recipe.id, "name": recipe.name}), HTTPStatus.CREATED

    if "file" not in request.files:
        return jsonify({"error": "No file part in the request."}), HTTPStatus.BAD_REQUEST

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected."}), HTTPStatus.BAD_REQUEST

    if not allowed_file(file.filename):
        return jsonify({"error": "Only PDF files are supported."}), HTTPStatus.BAD_REQUEST

    filename = secure_filename(file.filename)
    upload_path = Path(current_app.config["UPLOAD_FOLDER"]) / filename
    file.save(upload_path)

    recipe_data = extract_recipe_from_pdf(upload_path, Path(current_app.config["IMAGE_FOLDER"]))

    recipe = Recipe(
        name=recipe_data.name,
        protein=recipe_data.protein,
        ingredients=recipe_data.ingredients,
        servings=recipe_data.servings,
        image_filename=recipe_data.image_filename,
    )

    db.session.add(recipe)
    db.session.commit()

    return jsonify(recipe_data.to_dict() | {"id": recipe.id}), HTTPStatus.CREATED


@api_bp.route("/recipes", methods=["GET"])
def list_recipes() -> Any:
    """Return all stored recipes."""
    recipes = Recipe.query.order_by(Recipe.created_at.desc()).all()
    return jsonify([
        {
            "id": recipe.id,
            "name": recipe.name,
            "protein": recipe.protein,
            "ingredients": recipe.ingredients,
            "image": f"/api/images/{recipe.image_filename}" if recipe.image_filename else None,
            "servings": recipe.servings,
        }
        for recipe in recipes
    ])


@api_bp.route("/images/<path:filename>", methods=["GET"])
def serve_image(filename: str) -> Any:
    image_folder = current_app.config["IMAGE_FOLDER"]
    return send_from_directory(image_folder, filename)


@api_bp.route("/meal-plan", methods=["POST"])
def save_meal_plan() -> Any:
    payload = request.get_json(force=True)
    if not payload:
        return jsonify({"error": "Missing payload."}), HTTPStatus.BAD_REQUEST

    recipe_entries = payload.get("recipes", [])
    servings = payload.get("servings", 2)
    title = payload.get("title", "Weekly Plan")
    notes = payload.get("notes")

    if not recipe_entries:
        return jsonify({"error": "At least one recipe is required."}), HTTPStatus.BAD_REQUEST

    meal_plan = MealPlan.query.filter_by(is_active=1).first()
    if meal_plan is None:
        meal_plan = MealPlan(title=title, servings=servings, notes=notes)
        db.session.add(meal_plan)
    else:
        meal_plan.title = title
        meal_plan.servings = servings
        meal_plan.notes = notes
        meal_plan.recipes.clear()

    for entry in recipe_entries:
        recipe_id = entry.get("recipe_id")
        recipe_servings = entry.get("servings", servings)
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            continue
        link = MealPlanRecipe(recipe=recipe, servings=recipe_servings)
        meal_plan.recipes.append(link)

    db.session.commit()

    return jsonify({"id": meal_plan.id, "recipes": [link.recipe_id for link in meal_plan.recipes]}), HTTPStatus.CREATED


@api_bp.route("/shopping-list", methods=["GET"])
def shopping_list() -> Any:
    meal_plan = MealPlan.query.filter_by(is_active=1).order_by(MealPlan.created_at.desc()).first()
    if not meal_plan or not meal_plan.recipes:
        return jsonify({"shopping_list": {}})

    ingredient_entries: list[tuple[str, int]] = []
    for link in meal_plan.recipes:
        multiplier = link.servings / max(link.recipe.servings, 1)
        for ingredient in link.recipe.ingredients:
            ingredient_entries.append((ingredient, multiplier))

    consolidated = consolidate_ingredients(ingredient_entries)
    categorized = categorize_ingredients(consolidated)

    return jsonify({"shopping_list": categorized})
