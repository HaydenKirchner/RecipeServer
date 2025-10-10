import { useMemo, useState } from "react";
import { MealPlanBoard } from "./components/MealPlanBoard";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeFilters } from "./components/RecipeFilters";
import { ShoppingList } from "./components/ShoppingList";
import { MealPlanProvider } from "./contexts/MealPlanContext";
import { useRecipes } from "./hooks/useRecipes";
import type { ShoppingList as ShoppingListType } from "./types";

function AppContent() {
  const { recipes, filters, setFilters, loading, error, sortAscending, setSortAscending } = useRecipes();
  const [shoppingList, setShoppingList] = useState<ShoppingListType>({});

  const proteins = useMemo(() => {
    const values = new Set(
      recipes
        .map(recipe => recipe.protein?.toLowerCase())
        .filter((protein): protein is string => Boolean(protein))
    );
    return Array.from(values).sort();
  }, [recipes]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recipe Planner</h1>
          <p className="text-sm text-slate-400">Upload recipes, plan meals, and generate your shopping list.</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-cyan-300" type="button">
            Add Recipe
          </button>
          <button className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-accent" type="button">
            Import Recipe
          </button>
        </div>
      </header>

      <RecipeFilters
        filters={filters}
        onChange={setFilters}
        sortAscending={sortAscending}
        onToggleSort={() => setSortAscending(value => !value)}
        availableProteins={proteins}
      />

      {loading && <p className="text-sm text-slate-400">Loading recipes...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
            {recipes.length === 0 && !loading && (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-400">
                Upload a recipe PDF to get started.
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <MealPlanBoard recipes={recipes} onShoppingList={setShoppingList} />
          <ShoppingList list={shoppingList} />
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <MealPlanProvider>
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 md:px-10">
        <div className="mx-auto max-w-7xl space-y-10">
          <AppContent />
        </div>
      </main>
    </MealPlanProvider>
  );
}
