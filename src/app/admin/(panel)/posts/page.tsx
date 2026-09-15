import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PostList } from "@/components/admin/post-list";
import { AdminEmpty, AdminHeader, buttonClass } from "@/components/admin/ui";
import { listAdminPosts } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
        <PostList posts={posts} />
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
