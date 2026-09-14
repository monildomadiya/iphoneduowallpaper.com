"use client";

import { Loader2, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonClass } from "./ui";

/* ------------------------------------------------------------------ Switch */

export function Switch({
  name,
  checked,
  defaultChecked,
  onChange,
  label,
  description,
  disabled,
}: {
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const isOn = checked ?? internal;

  return (
    <label className={cn("flex cursor-pointer items-start justify-between gap-4", disabled && "cursor-not-allowed opacity-60")}>
      <span className="min-w-0">
        <span className="block text-[14px] font-medium text-fg">{label}</span>
        {description ? <span className="mt-0.5 block text-[12px] text-fg-3">{description}</span> : null}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          type="checkbox"
          name={name}
          className="peer sr-only"
          checked={isOn}
          disabled={disabled}
          onChange={(event) => {
            setInternal(event.target.checked);
            onChange?.(event.target.checked);
          }}
        />
        <span className="h-[26px] w-[44px] rounded-full bg-line-strong transition peer-checked:bg-success peer-focus-visible:ring-4 peer-focus-visible:ring-accent/25" />
        <span className="absolute left-[2px] top-[2px] size-[22px] rounded-full bg-white shadow transition peer-checked:translate-x-[18px]" />
      </span>
    </label>
  );
}

/* ------------------------------------------------------------------ Tag input */

export function TagInput({
  name,
  defaultValue = [],
  placeholder = "Add a tag and press Enter",
  onChange,
}: {
  name: string;
  defaultValue?: string[];
  placeholder?: string;
  onChange?: (tags: string[]) => void;
}) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");

  function commit(values: string[]) {
    setTags(values);
    onChange?.(values);
  }

  function add(raw: string) {
    const next = raw
      .split(",")
      .map((value) => value.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 40))
      .filter(Boolean);
    if (!next.length) return;
    commit([...new Set([...tags, ...next])].slice(0, 20));
    setDraft("");
  }

  return (
    <div className="flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-xl border border-line-strong/80 bg-elevated px-2.5 py-2 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
      <input type="hidden" name={name} value={tags.join(",")} />
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-surface py-0.5 pl-2.5 pr-1 text-[13px]">
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => commit(tags.filter((item) => item !== tag))}
            className="grid size-5 place-items-center rounded-full text-fg-3 hover:bg-surface-hover hover:text-fg"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            add(draft);
          } else if (event.key === "Backspace" && !draft && tags.length) {
            commit(tags.slice(0, -1));
          }
        }}
        onBlur={() => add(draft)}
        placeholder={tags.length ? "" : placeholder}
        className="min-w-[140px] flex-1 bg-transparent px-1 py-0.5 text-[14px] outline-none placeholder:text-fg-3"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ Modal */

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "md" | "lg";
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto w-[calc(100%-2rem)] rounded-[24px] border border-line bg-elevated p-0 text-fg shadow-float backdrop:bg-black/40 backdrop:backdrop-blur-sm",
        size === "lg" ? "max-w-3xl" : "max-w-lg",
      )}
    >
      {open ? (
        <div className="flex max-h-[85vh] flex-col">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-full hover:bg-surface">
              <X className="size-4" />
            </button>
          </header>
          <div className="overflow-y-auto px-5 py-5">{children}</div>
          {footer ? <footer className="flex justify-end gap-2 border-t border-line px-5 py-4">{footer}</footer> : null}
        </div>
      ) : null}
    </dialog>
  );
}

/* ------------------------------------------------------------------ Confirm */

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
}

const ConfirmContext = createContext<(options: ConfirmOptions) => Promise<boolean>>(async () => false);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<(ConfirmOptions & { resolve: (value: boolean) => void }) | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) => new Promise<boolean>((resolve) => setState({ ...options, resolve })),
    [],
  );

  function close(value: boolean) {
    state?.resolve(value);
    setState(null);
  }

  return (
    <ConfirmContext value={confirm}>
      {children}
      <Modal
        open={Boolean(state)}
        onClose={() => close(false)}
        title={state?.title ?? ""}
        footer={
          <>
            <button type="button" className={buttonClass.secondary} onClick={() => close(false)}>
              Cancel
            </button>
            <button
              type="button"
              autoFocus
              className={state?.destructive ? "inline-flex items-center justify-center rounded-full bg-danger px-4 py-2 text-[14px] font-medium text-white hover:opacity-90" : buttonClass.primary}
              onClick={() => close(true)}
            >
              {state?.confirmLabel ?? "Confirm"}
            </button>
          </>
        }
      >
        <p className="text-[15px] leading-6 text-fg-2">{state?.message}</p>
      </Modal>
    </ConfirmContext>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}

/* ------------------------------------------------------------------ Buttons */

export function PendingButton({
  pending,
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean; variant?: keyof typeof buttonClass }) {
  return (
    <button {...props} disabled={pending || props.disabled} className={cn(buttonClass[variant], className)}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
