"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass, selectClass } from "./ui";

export interface TaxonomyOption {
  id: string;
  name: string;
  hint?: string;
}

export function ChipMultiSelect({
  options,
  value,
  onChange,
  emptyLabel = "Nothing to choose yet",
}: {
  options: TaxonomyOption[];
  value: string[];
  onChange: (value: string[]) => void;
  emptyLabel?: string;
}) {
  if (!options.length) return <p className="text-[13px] text-fg-3">{emptyLabel}</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            title={option.hint}
            onClick={() => onChange(selected ? value.filter((id) => id !== option.id) : [...value, option.id])}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition",
              selected
                ? "border-accent bg-accent/10 text-link"
                : "border-line-strong/70 text-fg-2 hover:border-line-strong hover:text-fg",
            )}
          >
            {selected ? <Check className="size-3.5" /> : null}
            {option.name}
          </button>
        );
      })}
    </div>
  );
}

export function CategorySelect({
  id,
  options,
  value,
  onChange,
}: {
  id?: string;
  options: TaxonomyOption[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <select id={id} value={value ?? ""} onChange={(event) => onChange(event.target.value || null)} className={selectClass}>
      <option value="">No category</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}

export function StatusToggle({
  value,
  onChange,
}: {
  value: "draft" | "published";
  onChange: (value: "draft" | "published") => void;
}) {
  return (
    <div role="radiogroup" aria-label="Status" className="inline-flex w-full rounded-xl bg-surface p-1">
      {(["draft", "published"] as const).map((status) => (
        <button
          key={status}
          type="button"
          role="radio"
          aria-checked={value === status}
          onClick={() => onChange(status)}
          className={cn(
            "flex-1 rounded-lg px-3 py-1.5 text-[13px] font-medium capitalize transition",
            value === status ? "bg-elevated text-fg shadow-card" : "text-fg-2 hover:text-fg",
          )}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

export const SOURCE_OPTIONS = [
  { value: "original", label: "Original artwork" },
  { value: "ai", label: "AI-assisted artwork" },
  { value: "licensed", label: "Licensed" },
  { value: "public_domain", label: "Public domain / CC0" },
] as const;

export function SourceSelect({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: string;
  onChange: (value: "original" | "ai" | "licensed" | "public_domain") => void;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value as "original" | "ai" | "licensed" | "public_domain")}
      className={selectClass}
    >
      {SOURCE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <span className={cn("text-[12px]", value.length > max ? "text-danger" : "text-fg-3")}>
      {value.length}/{max}
    </span>
  );
}

export { inputClass };
