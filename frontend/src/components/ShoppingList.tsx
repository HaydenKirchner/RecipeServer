import type { ShoppingList as ShoppingListType } from "../types";

interface Props {
  list: ShoppingListType;
}

export function ShoppingList({ list }: Props) {
  const categories = Object.entries(list);

  return (
    <section className="rounded-2xl bg-surface/90 p-6 shadow-xl">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Shopping list</h2>
          <p className="text-sm text-slate-400">Automatically grouped by category.</p>
        </div>
      </header>
      {categories.length === 0 ? (
        <p className="text-sm text-slate-400">Generate a meal plan to see your shopping list.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map(([category, items]) => (
            <div key={category} className="rounded-xl border border-white/10 bg-background/40 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">{category}</h3>
              <ul className="mt-3 grid gap-2 text-sm text-slate-200">
                {items.map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
