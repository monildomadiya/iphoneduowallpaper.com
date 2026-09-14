import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/post-editor";
import { AdminHeader } from "@/components/admin/ui";
import { getAdminPost } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { UUID_PATTERN } from "@/lib/data/downloads";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Edit article" };

export default async function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const supabase = await createSupabaseServerClient();
  const post = await getAdminPost(supabase, id);
  if (!post) notFound();

  return (
    <>
      <AdminHeader title={post.title} back={{ href: "/admin/posts", label: "Blog posts" }} />
      <PostEditor key={post.updated_at} post={post} />
    </>
  );
}
