import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { Modal } from "./Modal";

type ImportRecipeDialogProps = {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
};

export function ImportRecipeDialog({ open, onClose, onImported }: ImportRecipeDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }
    resetState();
    onClose();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Select a PDF to import.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onImported();
      resetState();
      onClose();
    } catch (err) {
      setError("Unable to import recipe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Import Recipe" open={open} onClose={handleClose}>
      <p className="text-slate-300">Upload a recipe PDF and we will extract the details for you automatically.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="recipe-file">
            Recipe PDF
          </label>
          <input
            ref={fileInputRef}
            id="recipe-file"
            name="recipe-file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-dashed border-white/20 bg-slate-950/40 px-3 py-4 text-sm text-white focus:border-accent focus:outline-none"
            required
          />
          {fileName && <p className="text-xs text-slate-400">Selected: {fileName}</p>}
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
            {submitting ? "Importing..." : "Import"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
