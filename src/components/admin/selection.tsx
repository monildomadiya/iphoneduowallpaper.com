"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Checkbox selection for admin lists. Shift+click selects a range; rows that disappear drop out. */
export function useSelection(ids: string[]) {
  const [picked, setPicked] = useState<string[]>([]);
  const anchor = useRef<string | null>(null);

  const selected = picked.filter((id) => ids.includes(id));
  const allSelected = ids.length > 0 && selected.length === ids.length;

  function toggle(id: string, range = false) {
    const from = anchor.current ? ids.indexOf(anchor.current) : -1;
    const to = ids.indexOf(id);
    const turnOn = !selected.includes(id);
    anchor.current = id;

    if (range && from !== -1 && to !== -1) {
      const span = ids.slice(Math.min(from, to), Math.max(from, to) + 1);
      setPicked((current) =>
        turnOn ? [...new Set([...current, ...span])] : current.filter((item) => !span.includes(item)),
      );
      return;
    }
    setPicked((current) => (turnOn ? [...current, id] : current.filter((item) => item !== id)));
  }

  return {
    selected,
    allSelected,
    someSelected: selected.length > 0 && !allSelected,
    isSelected: (id: string) => selected.includes(id),
    toggle,
    toggleAll: () => setPicked(allSelected ? [] : ids),
    clear: () => setPicked([]),
  };
}

export function SelectBox({
  checked,
  indeterminate = false,
  label,
  onToggle,
}: {
  checked: boolean;
  indeterminate?: boolean;
  label: string;
  onToggle: (range: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      readOnly
      onClick={(event) => onToggle(event.shiftKey)}
      className="size-4 shrink-0 cursor-pointer accent-[var(--accent)]"
    />
  );
}

/** Floating action bar, so bulk actions stay in reach on long lists. */
export function BulkBar({ count, onClear, children }: { count: number; onClear: () => void; children: React.ReactNode }) {
  if (!count) return null;
  return (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      className="fixed inset-x-4 bottom-5 z-40 mx-auto flex w-fit max-w-[calc(100%-2rem)] flex-wrap items-center justify-center gap-2 rounded-2xl border border-line bg-elevated/95 p-2 shadow-card backdrop-blur sm:rounded-full"
    >
      <span className="px-2 text-[13px] font-medium tabular-nums">{count} selected</span>
      {children}
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear selection"
        className="grid size-8 place-items-center rounded-full text-fg-2 hover:bg-surface hover:text-fg"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
