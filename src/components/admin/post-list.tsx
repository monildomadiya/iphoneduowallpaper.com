"use client";

import { ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deletePosts } from "@/app/admin/actions/posts";
import type { Post } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { useConfirm } from "./client";
import { BulkBar, SelectBox, useSelection } from "./selection";
import { StatusBadge, buttonClass } from "./ui";

type PostListItem = Pick<Post, "id" | "title" | "slug" | "status" | "updated_at" | "author_name">;

export function PostList({ posts }: { posts: PostListItem[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const selection = useSelection(posts.map((post) => post.id));
  const [pending, startTransition] = useTransition();

  async function onDelete() {
    const ids = selection.selected;
    const ok = await confirm({
      title: `Delete ${ids.length} article${ids.length === 1 ? "" : "s"}?`,
      message: "Their cover images are removed too. This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const result = await deletePosts(ids);
      if (result.ok) {
        toast.success(result.message ?? "Deleted");
        selection.clear();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <div className="overflow-hidden rounded-[22px] border border-line bg-elevated shadow-card">
        <label className="flex cursor-pointer items-center gap-3 border-b border-line px-4 py-3 text-[13px] font-medium text-fg-2 sm:px-5 sm:py-2.5 sm:text-[12px] sm:text-fg-3">
          <SelectBox
            checked={selection.allSelected}
            indeterminate={selection.someSelected}
            label="Select all articles"
            onToggle={selection.toggleAll}
          />
          Select all
        </label>
        <ul className={cn("divide-y divide-line", pending && "opacity-60")}>
          {posts.map((post) => (
            <li key={post.id} className={cn("flex items-center", selection.isSelected(post.id) && "bg-accent/5")}>
              <label className="grid cursor-pointer place-items-center self-stretch pl-4 sm:pl-5">
                <SelectBox
                  checked={selection.isSelected(post.id)}
                  label={`Select ${post.title}`}
                  onToggle={(range) => selection.toggle(post.id, range)}
                />
              </label>
              <Link
                href={`/admin/posts/${post.id}`}
                className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3.5 transition hover:bg-surface/60 active:bg-surface/60 sm:gap-4 sm:px-4 sm:py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[15px] font-medium sm:truncate">{post.title}</p>
                  <p className="mt-0.5 truncate text-[12px] text-fg-3">
                    <span className="max-sm:hidden">/blog/{post.slug} · {post.author_name} · </span>
                    Updated {formatDate(post.updated_at, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <span className="mt-1.5 block sm:hidden">
                    <StatusBadge status={post.status} />
                  </span>
                </div>
                <span className="max-sm:hidden">
                  <StatusBadge status={post.status} />
                </span>
                <ChevronRight className="size-4 shrink-0 text-fg-3" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <BulkBar count={selection.selected.length} onClear={selection.clear}>
        <button type="button" disabled={pending} className={buttonClass.danger} onClick={onDelete}>
          <Trash2 className="size-4" />
          Delete
        </button>
      </BulkBar>
    </>
  );
}
