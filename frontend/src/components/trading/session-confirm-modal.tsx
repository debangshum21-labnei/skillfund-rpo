"use client";

import { Play } from "lucide-react";

export function SessionConfirmModal({ isOpen, onConfirm, onCancel }: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-strong"
        style={{ margin: "0 16px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ background: "var(--amber-dim)" }}
          >
            <Play className="h-5 w-5" style={{ color: "var(--amber)" }} />
          </span>
          <h3 className="text-lg font-semibold text-primary">
            No Active Session
          </h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Every trade in SkillFund must belong to a session. Start a new session and continue with this trade?
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-muted transition-all hover:bg-[var(--bg-elevated)] hover:text-primary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
            style={{ background: "var(--green)" }}
          >
            Start Session & Open Trade
          </button>
        </div>
      </div>
    </div>
  );
}
