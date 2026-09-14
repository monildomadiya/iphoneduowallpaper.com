"use client";

import { Eye, Loader2, PenLine, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { deletePost, savePost } from "@/app/admin/actions/posts";
import type { Post } from "@/lib/types";
import { cn, readingMinutes, slugify } from "@/lib/utils";
import { CoverPicker } from "./cover-picker";
import { TagInput, useConfirm } from "./client";
import { Card, Field, buttonClass, inputClass } from "./ui";
import { CharCount, StatusToggle } from "./wallpaper-fields";

const TEMPLATE = `Write a short introduction that explains what readers will learn.

## First section

Explain the topic in plain language. Use lists for steps:

1. First step
2. Second step

## Tips

- Keep paragraphs short.
- Link to related [wallpapers](/wallpapers) or [guides](/blog).
`;

export function PostEditor({ post }: { post: Post | null }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [saving, startSaving] = useTransition();
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [coverBusy, setCoverBusy] = useState(false);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? TEMPLATE);
  const [coverKey, setCoverKey] = useState<string | null>(post?.cover_key ?? null);
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [authorName, setAuthorName] = useState(post?.author_name ?? "Editorial Team");
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");

  function save() {
    startSaving(async () => {
      const result = await savePost({
        id: post?.id ?? null,
        title,
        slug,
        excerpt,
        content,
        coverKey,
        tags,
        authorName,
        status,
        seoTitle,
        seoDescription,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Saved");
      setSlug(result.data.slug);
      if (!post) router.replace(`/admin/posts/${result.data.id}`);
      router.refresh();
    });
  }

  async function remove() {
    if (!post) return;
    const ok = await confirm({
      title: "Delete this article?",
      message: "This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    const result = await deletePost(post.id);
    if (result.ok) {
      toast.success("Article deleted");
      router.push("/admin/posts");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const words = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="grid gap-6 pb-24 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <Card>
          <div className="space-y-5">
            <Field label="Title" htmlFor="post-title">
              <input
                id="post-title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  if (!slugTouched) setSlug(slugify(event.target.value));
                }}
                className={cn(inputClass, "text-[19px] font-semibold")}
                placeholder="How to…"
              />
            </Field>
            <Field label="Excerpt" htmlFor="post-excerpt" hint="One or two sentences shown on cards and search results.">
              <textarea
                id="post-excerpt"
                rows={2}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                className={cn(inputClass, "resize-y")}
              />
            </Field>
          </div>
        </Card>

        <Card
          title="Content"
          description={`${words} words · ${readingMinutes(content)} min read · Markdown supported`}
          actions={
            <div className="inline-flex rounded-full bg-surface p-1">
              {(["write", "preview"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium capitalize",
                    tab === value ? "bg-elevated shadow-card" : "text-fg-2",
                  )}
                >
                  {value === "write" ? <PenLine className="size-3.5" /> : <Eye className="size-3.5" />}
                  {value}
                </button>
              ))}
            </div>
          }
        >
          {tab === "write" ? (
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={24}
              spellCheck
              className={cn(inputClass, "min-h-[480px] resize-y font-mono text-[14px] leading-6")}
            />
          ) : (
            <div className="prose-apple min-h-[480px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}
        </Card>

        <Card title="Search engine listing">
          <div className="space-y-5">
            <Field label="SEO title" htmlFor="post-seo-title" hint="Defaults to the article title">
              <input id="post-seo-title" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} className={inputClass} />
              <div className="mt-1 text-right">
                <CharCount value={seoTitle} max={60} />
              </div>
            </Field>
            <Field label="Meta description" htmlFor="post-seo-description" hint="Defaults to the excerpt">
              <textarea
                id="post-seo-description"
                rows={2}
                value={seoDescription}
                onChange={(event) => setSeoDescription(event.target.value)}
                className={cn(inputClass, "resize-y")}
              />
              <div className="mt-1 text-right">
                <CharCount value={seoDescription} max={160} />
              </div>
            </Field>
          </div>
        </Card>
      </div>

      <div className="space-y-5 xl:sticky xl:top-6 xl:self-start">
        <Card title="Publishing">
          <div className="space-y-5">
            <Field label="Status">
              <StatusToggle value={status} onChange={setStatus} />
            </Field>
            <Field label="URL slug" htmlFor="post-slug" hint={`/blog/${slug || "…"}`}>
              <input
                id="post-slug"
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(slugify(event.target.value));
                }}
                className={inputClass}
              />
            </Field>
            <Field label="Author" htmlFor="post-author">
              <input id="post-author" value={authorName} onChange={(event) => setAuthorName(event.target.value)} className={inputClass} />
            </Field>
            <Field label="Tags">
              <TagInput name="tags" defaultValue={post?.tags ?? []} onChange={setTags} />
            </Field>
            <Field label="Cover image">
              <CoverPicker value={coverKey} onChange={setCoverKey} onBusyChange={setCoverBusy} />
            </Field>
            {post?.status === "published" ? (
              <Link href={`/blog/${post.slug}`} target="_blank" className="block text-[13px] text-link hover:underline">
                View live article ›
              </Link>
            ) : null}
          </div>
        </Card>
      </div>

      <div className="glass fixed inset-x-0 bottom-0 z-30 border-t border-line lg:left-64">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          {post ? (
            <button type="button" onClick={remove} className={buttonClass.danger}>
              <Trash2 className="size-4" />
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Link href="/admin/posts" className={buttonClass.secondary}>
              Back
            </Link>
            <button type="button" onClick={save} disabled={saving || coverBusy} className={buttonClass.primary}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {status === "published" ? "Save & publish" : "Save draft"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
