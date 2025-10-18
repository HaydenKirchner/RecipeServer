export type ServingSize = 2 | 4;

export interface RecipeSummary {
  id: number;
  name: string;
  protein: string | null;
  ingredients: string[];
  image: string | null;
  servings: number;
}

export interface MealPlanEntry {
  recipe_id: number;
  servings: ServingSize;
}

export interface MealPlanPayload {
  title: string;
  servings: ServingSize;
  notes?: string;
  recipes: MealPlanEntry[];
}

export type ShoppingList = Record<string, string[]>;
