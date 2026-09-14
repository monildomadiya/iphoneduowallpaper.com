/* eslint-disable @next/next/no-img-element -- covers are pre-optimized WebP files served from Cloudflare R2 */
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Artwork, DeviceFrame, bestVariantFor } from "@/components/wallpaper/device-frame";
import type { Category, Collection, Device, PostCardData } from "@/lib/types";
import { cn, formatDate, imageUrl } from "@/lib/utils";

function countLabel(count: number) {
  return `${count} ${count === 1 ? "wallpaper" : "wallpapers"}`;
}

export function CategoryTiles({ categories, className }: { categories: Category[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5", className)}>
      {categories.map((category, index) => (
        <li key={category.id}>
          <Link
            href={`/categories/${category.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-[24px] bg-surface shadow-card ring-1 ring-line"
          >
            {category.cover_thumb_key ? (
              <img
                src={imageUrl(category.cover_thumb_key)}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover transition duration-700 ease-apple group-hover:scale-105"
              />
            ) : (
              <Artwork index={index} />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <h3 className="text-[19px] font-semibold tracking-tight">{category.name}</h3>
              <p className="mt-0.5 text-[13px] text-white/75">{countLabel(category.wallpaper_count)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function CollectionTiles({ collections, className }: { collections: Collection[]; className?: string }) {
  return (
    <ul className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {collections.map((collection, index) => (
        <li key={collection.id}>
          <Link
            href={`/collections/${collection.slug}`}
            className="group relative flex aspect-[16/11] flex-col justify-end overflow-hidden rounded-[28px] bg-surface p-6 shadow-card ring-1 ring-line"
          >
            {collection.cover_thumb_key ? (
              <img
                src={imageUrl(collection.cover_thumb_key)}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover transition duration-700 ease-apple group-hover:scale-105"
              />
            ) : (
              <Artwork index={index + 1} />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition group-hover:bg-white/35">
              <ArrowUpRight className="size-4" />
            </span>
            <div className="relative text-white">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">Collection</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">{collection.name}</h3>
              {collection.description ? (
                <p className="mt-1.5 line-clamp-2 text-[14px] leading-5 text-white/80">{collection.description}</p>
              ) : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function DeviceTiles({ devices, className }: { devices: Device[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      {devices.map((device, index) => {
        const variant = device.width > device.height ? "duo-inner" : bestVariantFor(device.width, device.height);
        return (
          <li key={device.id}>
            <Link
              href={`/devices/${device.slug}`}
              className="group flex h-full flex-col items-center rounded-[28px] bg-surface px-5 pb-6 pt-8 text-center transition hover:bg-surface-hover"
            >
              <div className="flex h-44 w-full items-end justify-center md:h-52">
                <DeviceFrame
                  variant={variant}
                  src={device.cover_thumb_key ? imageUrl(device.cover_thumb_key) : null}
                  artwork={index}
                  mode="lock"
                  className={cn(
                    "transition duration-700 ease-apple group-hover:-translate-y-1.5",
                    variant === "duo-inner" ? "w-full max-w-[250px]" : "h-full",
                  )}
                />
              </div>
              <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.12em] text-fg-3">{device.family}</p>
              <h3 className="mt-1 text-[19px] font-semibold tracking-tight">{device.name}</h3>
              <p className="mt-1 text-[14px] text-fg-2">
                {device.width} × {device.height} px
              </p>
              <p className="mt-0.5 text-[13px] text-fg-3">{countLabel(device.wallpaper_count)}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-surface transition hover:bg-surface-hover">
      <div className="relative aspect-[16/9] overflow-hidden">
        {post.cover_key ? (
          <img
            src={imageUrl(post.cover_key)}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition duration-700 ease-apple group-hover:scale-105"
          />
        ) : (
          <Artwork index={post.title.length} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-fg-3">
          {post.tags[0] ?? "Guide"}
        </p>
        <h3 className="mt-2 text-[21px] font-semibold leading-7 tracking-tight">{post.title}</h3>
        {post.excerpt ? <p className="mt-2 line-clamp-3 text-[15px] leading-6 text-fg-2">{post.excerpt}</p> : null}
        <p className="mt-auto pt-5 text-[13px] text-fg-3">
          {formatDate(post.published_at, { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
    </Link>
  );
}

export function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((faq) => (
        <details key={faq.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[19px] font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface text-fg-2 transition group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 max-w-3xl text-[17px] leading-7 text-fg-2">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
