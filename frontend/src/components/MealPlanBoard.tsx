import axios from "axios";
import { useMemo, useState } from "react";
import { useMealPlan } from "../contexts/MealPlanContext";
import type { RecipeSummary, ServingSize, ShoppingList } from "../types";

interface Props {
  recipes: RecipeSummary[];
  onShoppingList: (list: ShoppingList) => void;
}

export function MealPlanBoard({ recipes, onShoppingList }: Props) {
  const { entries, servings, setServings, clear } = useMealPlan();
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const activeRecipes = useMemo(() => {
    return entries
      .map(entry => ({
        entry,
        recipe: recipes.find(recipe => recipe.id === entry.recipe_id)
      }))
      .filter(({ recipe }) => Boolean(recipe));
  }, [entries, recipes]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post("/api/meal-plan", {
        title: "Weekly Plan",
        servings,
        notes,
        recipes: entries
      });
      const response = await axios.get<{ shopping_list: ShoppingList }>("/api/shopping-list");
      onShoppingList(response.data.shopping_list);
      setMessage("Meal plan saved! Shopping list updated.");
    } catch (error) {
      setMessage("Unable to save meal plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-surface/90 p-6 shadow-xl">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Meal plan</h2>
          <p className="text-sm text-slate-400">Select recipes and serving sizes for the week.</p>
        </div>
        <div className="flex items-center gap-2">
          {[2, 4].map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setServings(option as ServingSize)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                servings === option
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-white/10 bg-background/60 text-slate-300 hover:border-accent"
              }`}
            >
              {option} servings
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-3">
        {activeRecipes.length === 0 ? (
          <p className="text-sm text-slate-400">No recipes selected yet.</p>
        ) : (
          activeRecipes.map(({ recipe, entry }) => (
            <article key={entry.recipe_id} className="rounded-xl border border-white/10 bg-background/40 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{recipe?.name}</h3>
                  <p className="text-xs text-slate-400">{recipe?.ingredients.length} ingredients</p>
                </div>
                <span className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent">
                  {entry.servings} servings
                </span>
              </div>
            </article>
          ))
        )}
      </div>

      <label className="grid gap-2 text-sm">
        <span>Notes</span>
        <textarea
          className="min-h-[120px] rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          value={notes}
          onChange={event => setNotes(event.target.value)}
          placeholder="Add reminders or grocery notes"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || entries.length === 0}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {saving ? "Saving..." : "Save plan & generate list"}
        </button>
        <button
          type="button"
          onClick={clear}
          className="rounded-full border border-white/20 px-5 py-2 text-sm transition hover:border-accent"
        >
          Clear
        </button>
        {message && <p className="text-sm text-slate-400">{message}</p>}
      </div>
    </section>
  );
}
