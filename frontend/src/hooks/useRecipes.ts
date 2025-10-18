import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { RecipeSummary } from "../types";

export type RecipeFilters = {
  search: string;
  protein: string;
  minIngredients: number;
  maxIngredients: number;
};

const defaultFilters: RecipeFilters = {
  search: "",
  protein: "all",
  minIngredients: 0,
  maxIngredients: 50
};

export function useRecipes() {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  const reload = useCallback(() => {
    setRefreshToken(token => token + 1);
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get<RecipeSummary[]>("/api/recipes")
      .then(response => setRecipes(response.data))
      .catch(() => setError("Unable to load recipes"))
      .finally(() => setLoading(false));
  }, [refreshToken]);

  const filtered = useMemo(() => {
    const normalizedSearch = filters.search.toLowerCase();
    return recipes
      .filter(recipe => {
        const matchesProtein =
          filters.protein === "all" || (recipe.protein ?? "").toLowerCase() === filters.protein;
        const matchesSearch =
          recipe.name.toLowerCase().includes(normalizedSearch) ||
          recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(normalizedSearch));
        const ingredientCount = recipe.ingredients.length;
        const meetsIngredientBounds =
          ingredientCount >= filters.minIngredients && ingredientCount <= filters.maxIngredients;
        return matchesProtein && matchesSearch && meetsIngredientBounds;
      })
      .sort((a, b) => {
        const direction = sortAscending ? 1 : -1;
        return direction * a.name.localeCompare(b.name);
      });
  }, [recipes, filters, sortAscending]);

  return {
    recipes: filtered,
    loading,
    error,
    filters,
    setFilters,
    sortAscending,
    setSortAscending,
    reload
  };
}
