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
      className="size-5 shrink-0 cursor-pointer accent-[var(--accent)] sm:size-4"
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
      className="fixed inset-x-3 bottom-[calc(var(--tabbar-h,0px)+0.75rem)] z-40 mx-auto flex w-fit max-w-[calc(100%-1.5rem)] animate-pop-in flex-wrap items-center justify-center gap-1.5 rounded-[22px] border border-line bg-elevated/95 p-1.5 shadow-float backdrop-blur sm:rounded-full lg:bottom-5"
    >
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear selection"
        title="Clear selection"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-surface text-fg-2 hover:bg-surface-hover hover:text-fg"
      >
        <X className="size-4" />
      </button>
      <span className="shrink-0 pl-1 pr-1.5 text-[13px] font-semibold tabular-nums">{count} selected</span>
      <div className="flex min-w-0 flex-wrap items-center justify-center gap-1.5 max-sm:*:min-h-9 max-sm:*:px-3 max-sm:*:text-[13px]">{children}</div>
    </div>
  );
}
