import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminEmpty, AdminHeader, Badge, buttonClass } from "@/components/admin/ui";
import { listAdminPosts } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Blog posts" };

export default async function AdminPostsPage() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const posts = await listAdminPosts(supabase);

  return (
    <>
      <AdminHeader
        title="Blog posts"
        description="Helpful, original guides make your site more valuable to readers — and to AdSense reviewers."
        actions={
          <Link href="/admin/posts/new" className={buttonClass.primary}>
            <Plus className="size-4" />
            New article
          </Link>
        }
      />

      {posts.length ? (
        <div className="overflow-hidden rounded-[22px] border border-line bg-elevated shadow-card">
          <ul className="divide-y divide-line">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/admin/posts/${post.id}`} className="flex items-center gap-4 px-5 py-4 transition hover:bg-surface/60">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium">{post.title}</p>
                    <p className="mt-0.5 truncate text-[12px] text-fg-3">
                      /blog/{post.slug} · {post.author_name} · updated {formatDate(post.updated_at, { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <Badge tone={post.status === "published" ? "green" : "gray"}>{post.status}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <AdminEmpty
          title="No articles yet"
          description="Write guides like “Best wallpapers for OLED” or “How to set a Depth Effect wallpaper”."
          action={
            <Link href="/admin/posts/new" className={buttonClass.primary}>
              Write your first article
            </Link>
          }
        />
      )}
    </>
  );
}
