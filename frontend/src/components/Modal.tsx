import type { PropsWithChildren } from "react";

export type ModalProps = PropsWithChildren<{
  title: string;
  open: boolean;
  onClose: () => void;
}>;

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/20 px-2 py-1 text-xs text-slate-300 transition hover:border-accent hover:text-white"
          aria-label="Close dialog"
        >
          Close
        </button>
        <div className="mt-4 space-y-4 text-sm text-slate-200">{children}</div>
      </div>
    </div>
  );
}
