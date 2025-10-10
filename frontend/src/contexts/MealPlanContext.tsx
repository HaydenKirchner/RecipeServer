import { createContext, useContext, useMemo, useState } from "react";
import type { MealPlanEntry, ServingSize } from "../types";

type MealPlanContextValue = {
  entries: MealPlanEntry[];
  servings: ServingSize;
  setServings: (servings: ServingSize) => void;
  toggleEntry: (recipeId: number) => void;
  setEntryServings: (recipeId: number, servings: ServingSize) => void;
  clear: () => void;
};

const MealPlanContext = createContext<MealPlanContextValue | undefined>(undefined);

export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<MealPlanEntry[]>([]);
  const [servings, setServings] = useState<ServingSize>(2);

  const value = useMemo<MealPlanContextValue>(() => ({
    entries,
    servings,
    setServings,
    toggleEntry: (recipeId: number) => {
      setEntries(current => {
        if (current.some(entry => entry.recipe_id === recipeId)) {
          return current.filter(entry => entry.recipe_id !== recipeId);
        }
        return [...current, { recipe_id: recipeId, servings }];
      });
    },
    setEntryServings: (recipeId: number, entryServings: ServingSize) => {
      setEntries(current =>
        current.map(entry =>
          entry.recipe_id === recipeId ? { ...entry, servings: entryServings } : entry
        )
      );
    },
    clear: () => setEntries([])
  }), [entries, servings]);

  return <MealPlanContext.Provider value={value}>{children}</MealPlanContext.Provider>;
}

export function useMealPlan() {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error("useMealPlan must be used within a MealPlanProvider");
  }
  return context;
}
