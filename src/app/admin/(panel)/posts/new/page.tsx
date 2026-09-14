import type { Metadata } from "next";
import { PostEditor } from "@/components/admin/post-editor";
import { AdminHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "New article" };

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <>
      <AdminHeader title="New article" back={{ href: "/admin/posts", label: "Blog posts" }} />
      <PostEditor post={null} />
    </>
  );
}
