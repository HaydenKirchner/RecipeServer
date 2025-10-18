import { useMemo } from "react";
import type { RecipeFilters } from "../hooks/useRecipes";

interface Props {
  filters: RecipeFilters;
  onChange: (filters: RecipeFilters) => void;
  sortAscending: boolean;
  onToggleSort: () => void;
  availableProteins: string[];
}

export function RecipeFilters({ filters, onChange, sortAscending, onToggleSort, availableProteins }: Props) {
  const proteinOptions = useMemo(() => ["all", ...availableProteins], [availableProteins]);

  return (
    <section className="grid gap-4 rounded-lg bg-surface/80 p-6 shadow-lg">
      <h2 className="text-xl font-semibold">Filters</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm">
          <span>Search recipes</span>
          <input
            className="rounded-md border border-white/10 bg-background/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            value={filters.search}
            onChange={event => onChange({ ...filters, search: event.target.value })}
            placeholder="Search by name or ingredient"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Protein</span>
          <select
            className="rounded-md border border-white/10 bg-background/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            value={filters.protein}
            onChange={event => onChange({ ...filters, protein: event.target.value })}
          >
            {proteinOptions.map(option => (
              <option key={option} value={option}>
                {option === "all" ? "All" : option.replace(/^[a-z]/, match => match.toUpperCase())}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Min ingredients</span>
          <input
            type="number"
            min={0}
            className="rounded-md border border-white/10 bg-background/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            value={filters.minIngredients}
            onChange={event => onChange({ ...filters, minIngredients: Number(event.target.value) })}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Max ingredients</span>
          <input
            type="number"
            min={1}
            className="rounded-md border border-white/10 bg-background/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            value={filters.maxIngredients}
            onChange={event => onChange({ ...filters, maxIngredients: Number(event.target.value) })}
          />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-full bg-accent/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-accent"
          onClick={onToggleSort}
          type="button"
        >
          Sort {sortAscending ? "Ascending" : "Descending"}
        </button>
        <button
          className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-accent"
          onClick={() => onChange({ ...filters, search: "", protein: "all", minIngredients: 0, maxIngredients: 50 })}
          type="button"
        >
          Reset filters
        </button>
      </div>
    </section>
  );
}
