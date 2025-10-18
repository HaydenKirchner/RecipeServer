"""Database models."""
from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from .database import db


class Recipe(db.Model):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    protein: Mapped[str] = mapped_column(String(100), nullable=True)
    ingredients: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    image_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    servings: Mapped[int] = mapped_column(Integer, default=2)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )

    meal_links: Mapped[list["MealPlanRecipe"]] = relationship("MealPlanRecipe", back_populates="recipe")


class MealPlan(db.Model):
    __tablename__ = "meal_plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(120), default="Weekly Plan")
    servings: Mapped[int] = mapped_column(Integer, default=2)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )

    recipes: Mapped[list["MealPlanRecipe"]] = relationship("MealPlanRecipe", back_populates="meal_plan", cascade="all, delete-orphan")


class MealPlanRecipe(db.Model):
    __tablename__ = "meal_plan_recipes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    meal_plan_id: Mapped[int] = mapped_column(ForeignKey("meal_plans.id", ondelete="CASCADE"))
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id"))
    servings: Mapped[int] = mapped_column(Integer, default=2)

    meal_plan: Mapped[MealPlan] = relationship("MealPlan", back_populates="recipes")
    recipe: Mapped[Recipe] = relationship("Recipe", back_populates="meal_links")
