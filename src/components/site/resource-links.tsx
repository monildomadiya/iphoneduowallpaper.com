import Link from "next/link";
import { listPosts } from "@/lib/data/posts";
import type { ResourceLink } from "@/lib/guide-links";

/** Article recommendations only link to currently published posts. */
export async function ResourceLinks({ title, links }: { title: string; links: ResourceLink[] }) {
  const published = links.some((link) => link.href.startsWith("/blog/"))
    ? new Set((await listPosts(1, 50)).items.map((post) => `/blog/${post.slug}`))
    : null;
  const visible = links.filter((link) => !link.href.startsWith("/blog/") || published?.has(link.href));
  if (!visible.length) return null;
  return (
    <section className="my-10 rounded-[24px] border border-line bg-surface p-6 md:p-8">
      <h2 className="text-[22px] font-semibold tracking-tight">{title}</h2>
      <ul className="mt-5 grid gap-6 sm:grid-cols-2">
        {visible.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="link-apple font-medium">{link.label}</Link>
            <p className="mt-2 text-[15px] leading-6 text-fg-2">{link.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
