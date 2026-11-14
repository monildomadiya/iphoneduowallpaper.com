"use client";

import {
  Bold,
  Columns2,
  Eye,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  PenLine,
  Quote,
  Strikethrough,
} from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { inputClass } from "./ui";

/**
 * A writing box with a formatting toolbar, the familiar shortcuts and a live preview.
 *
 * It stores Markdown rather than HTML: the same text the blog already uses, rendered on the site
 * by the safe <Markdown> component, so nothing an editor types can inject markup into a page.
 * The toolbar wraps the selection the way a word processor would, so you can write without
 * knowing the syntax; the preview shows exactly what the page will render.
 */

type Wrap = { before: string; after: string };
type LinePrefix = { prefix: string };
type Action = Wrap | LinePrefix;

const isWrap = (action: Action): action is Wrap => "before" in action;

interface Tool {
  key: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  action: Action;
  /** Lowercase letter for Ctrl/Cmd + key. */
  shortcut?: string;
}

const TOOLS: Tool[] = [
  { key: "bold", label: "Bold", hint: "Ctrl + B", icon: Bold, action: { before: "**", after: "**" }, shortcut: "b" },
  { key: "italic", label: "Italic", hint: "Ctrl + I", icon: Italic, action: { before: "_", after: "_" }, shortcut: "i" },
  { key: "strike", label: "Strikethrough", hint: "", icon: Strikethrough, action: { before: "~~", after: "~~" } },
  { key: "h2", label: "Heading", hint: "Section heading", icon: Heading2, action: { prefix: "## " } },
  { key: "h3", label: "Subheading", hint: "Smaller heading", icon: Heading3, action: { prefix: "### " } },
  { key: "ul", label: "Bulleted list", hint: "", icon: List, action: { prefix: "- " } },
  { key: "ol", label: "Numbered list", hint: "", icon: ListOrdered, action: { prefix: "1. " } },
  { key: "quote", label: "Quote", hint: "", icon: Quote, action: { prefix: "> " } },
  { key: "link", label: "Link", hint: "Ctrl + K", icon: Link2, action: { before: "[", after: "](https://)" }, shortcut: "k" },
];

/** Grows the selection to whole lines, so a list button marks every line you highlighted. */
function lineRange(value: string, start: number, end: number): [number, number] {
  const from = value.lastIndexOf("\n", start - 1) + 1;
  const lineEnd = value.indexOf("\n", end);
  return [from, lineEnd === -1 ? value.length : lineEnd];
}

export function RichTextEditor({
  value,
  onChange,
  rows = 16,
  placeholder,
  id,
}: {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
  id?: string;
}) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const ref = useRef<HTMLTextAreaElement>(null);
  const [view, setView] = useState<"write" | "split" | "preview">("write");

  const apply = useCallback(
    (action: Action) => {
      const field = ref.current;
      if (!field) return;
      const { selectionStart: start, selectionEnd: end } = field;

      let next: string;
      let caret: [number, number];

      if (isWrap(action)) {
        const selected = value.slice(start, end);
        // Clicking an active button again takes the marks off, the way a toolbar should behave.
        const wrapped =
          selected.startsWith(action.before) && selected.endsWith(action.after) && selected.length > action.before.length;
        if (wrapped) {
          const inner = selected.slice(action.before.length, selected.length - action.after.length);
          next = value.slice(0, start) + inner + value.slice(end);
          caret = [start, start + inner.length];
        } else {
          next = value.slice(0, start) + action.before + selected + action.after + value.slice(end);
          // With nothing selected the caret lands between the marks, ready to type.
          caret = selected
            ? [start + action.before.length, start + action.before.length + selected.length]
            : [start + action.before.length, start + action.before.length];
        }
      } else {
        const [from, to] = lineRange(value, start, end);
        const lines = value.slice(from, to).split("\n");
        const allMarked = lines.every((line) => line.startsWith(action.prefix));
        const marked = lines
          .map((line, index) => {
            if (allMarked) return line.slice(action.prefix.length);
            // A numbered list counts up instead of repeating "1.".
            const prefix = action.prefix === "1. " ? `${index + 1}. ` : action.prefix;
            return line.startsWith(prefix) ? line : prefix + line;
          })
          .join("\n");
        next = value.slice(0, from) + marked + value.slice(to);
        caret = [from, from + marked.length];
      }

      onChange(next);
      // The value lands on the next render, so the selection is restored after it.
      requestAnimationFrame(() => {
        field.focus();
        field.setSelectionRange(caret[0], caret[1]);
      });
    },
    [onChange, value],
  );

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!event.ctrlKey && !event.metaKey) return;
    const tool = TOOLS.find((item) => item.shortcut === event.key.toLowerCase());
    if (!tool) return;
    event.preventDefault();
    apply(tool.action);
  }

  const words = value.trim().split(/\s+/).filter(Boolean).length;
  const showWrite = view !== "preview";
  const showPreview = view !== "write";

  return (
    <div className="overflow-hidden rounded-xl border border-line-strong/80 bg-elevated">
      <div className="flex flex-wrap items-center gap-1 border-b border-line bg-surface/60 px-2 py-1.5">
        {TOOLS.map((tool, index) => (
          <span key={tool.key} className="contents">
            {index === 3 || index === 5 || index === 8 ? <span className="mx-1 h-5 w-px bg-line" aria-hidden /> : null}
            <button
              type="button"
              onClick={() => apply(tool.action)}
              title={tool.hint ? `${tool.label} (${tool.hint})` : tool.label}
              aria-label={tool.label}
              disabled={view === "preview"}
              className="grid size-8 place-items-center rounded-lg text-fg-2 transition hover:bg-surface-hover hover:text-fg active:scale-95 disabled:opacity-40"
            >
              <tool.icon className="size-4" />
            </button>
          </span>
        ))}
        <div className="ml-auto inline-flex rounded-full bg-surface p-0.5">
          {(
            [
              ["write", PenLine, "Write"],
              ["split", Columns2, "Split"],
              ["preview", Eye, "Preview"],
            ] as const
          ).map(([key, Icon, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              title={label}
              aria-label={label}
              aria-pressed={view === key}
              className={cn(
                "grid size-7 place-items-center rounded-full transition",
                view === key ? "bg-elevated text-fg shadow-card" : "text-fg-3 hover:text-fg-2",
              )}
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
      </div>

      <div className={cn("grid", view === "split" ? "md:grid-cols-2 md:divide-x md:divide-line" : "grid-cols-1")}>
        {showWrite ? (
          <textarea
            id={textareaId}
            ref={ref}
            value={value}
            rows={rows}
            spellCheck
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            className={cn(
              inputClass,
              "min-h-[320px] resize-y rounded-none border-0 bg-transparent font-mono text-[14px] leading-6 focus:ring-0",
            )}
          />
        ) : null}
        {showPreview ? (
          <div className="min-h-[320px] overflow-x-auto px-3.5 py-2.5">
            {value.trim() ? (
              <div className="prose-apple prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-[14px] text-fg-3">Nothing to preview yet.</p>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line bg-surface/60 px-3 py-1.5 text-[12px] text-fg-3">
        <span>Markdown · select text, then use the buttons</span>
        <span>
          {words} {words === 1 ? "word" : "words"}
        </span>
      </div>
    </div>
  );
}
