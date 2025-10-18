import { useState, type FormEvent } from "react";
import axios from "axios";
import { Modal } from "./Modal";

type AddRecipeDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function AddRecipeDialog({ open, onClose, onCreated }: AddRecipeDialogProps) {
  const [name, setName] = useState("");
  const [protein, setProtein] = useState("");
  const [servings, setServings] = useState(2);
  const [ingredientsText, setIngredientsText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setProtein("");
    setServings(2);
    setIngredientsText("");
    setError(null);
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }
    resetForm();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Recipe name is required.");
      return;
    }

    const ingredients = ingredientsText
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);

    if (ingredients.length === 0) {
      setError("Please provide at least one ingredient.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await axios.post(
        "/api/upload",
        {
          name: name.trim(),
          protein: protein.trim() || undefined,
          servings,
          ingredients
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      onCreated();
      resetForm();
      onClose();
    } catch (err) {
      setError("Unable to save recipe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Add Recipe" open={open} onClose={handleClose}>
      <p className="text-slate-300">Add a recipe manually by specifying the key details below.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="recipe-name">
            Recipe Name
          </label>
          <input
            id="recipe-name"
            name="recipe-name"
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
            required
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="recipe-protein">
              Protein Source
            </label>
            <input
              id="recipe-protein"
              name="recipe-protein"
              type="text"
              value={protein}
              onChange={event => setProtein(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
              placeholder="Optional"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="recipe-servings">
              Servings
            </label>
            <input
              id="recipe-servings"
              name="recipe-servings"
              type="number"
              min={1}
              max={12}
              value={servings}
              onChange={event => setServings(Number(event.target.value))}
              className="w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="recipe-ingredients">
            Ingredients
          </label>
          <textarea
            id="recipe-ingredients"
            name="recipe-ingredients"
            value={ingredientsText}
            onChange={event => setIngredientsText(event.target.value)}
            placeholder="One ingredient per line"
            rows={6}
            className="w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
            required
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-300 transition hover:border-accent hover:text-white"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Recipe"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
