import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useMealPlan } from "../contexts/MealPlanContext";
import type { RecipeSummary, ServingSize } from "../types";

interface Props {
  recipe: RecipeSummary;
}

const servingOptions: ServingSize[] = [2, 4];

export function RecipeCard({ recipe }: Props) {
  const { entries, toggleEntry, setEntryServings } = useMealPlan();
  const [expanded, setExpanded] = useState(false);

  const entry = entries.find(item => item.recipe_id === recipe.id);
  const isSelected = Boolean(entry);

  return (
    <article className="grid gap-4 rounded-2xl bg-surface/80 p-4 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start gap-4">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="h-32 w-32 rounded-xl object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-background/60 text-sm text-slate-400">
            No image
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{recipe.name}</h3>
            {recipe.protein && (
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                {recipe.protein}
              </span>
            )}
          </div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{recipe.ingredients.length} ingredients</p>
          <div className="flex flex-wrap items-center gap-2">
            {servingOptions.map(option => (
              <button
                key={option}
                type="button"
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  entry?.servings === option
                    ? "border-accent bg-accent/20 text-accent"
                    : "border-white/10 bg-background/60 text-slate-300 hover:border-accent"
                }`}
                onClick={() => setEntryServings(recipe.id, option)}
              >
                {option} servings
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setExpanded(value => !value)}
          className="text-sm font-medium text-accent hover:underline"
        >
          {expanded ? "Hide" : "View"} ingredients
        </button>
        {expanded && (
          <ul className="grid gap-1 text-sm text-slate-200">
            {recipe.ingredients.map(ingredient => (
              <li key={ingredient} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {ingredient}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
          isSelected
            ? "bg-emerald-400/90 text-emerald-950 hover:bg-emerald-400"
            : "bg-accent/90 text-slate-950 hover:bg-accent"
        }`}
        type="button"
        onClick={() => toggleEntry(recipe.id)}
      >
        {isSelected ? <Check size={16} /> : <Plus size={16} />} {isSelected ? "Added" : "Add to meal plan"}
      </button>
    </article>
  );
}
