import Link from "next/link";
import { DeviceFrame } from "@/components/wallpaper/device-frame";

export function NotFoundContent() {
  return (
    <section className="container-apple flex flex-col items-center py-20 text-center md:py-28">
      <DeviceFrame variant="duo-outer" mode="lock" artwork={1} className="w-40" />
      <p className="mt-10 text-[15px] font-semibold text-fg-2">Error 404</p>
      <h1 className="headline-page mt-2">This page folded away.</h1>
      <p className="mt-4 max-w-md text-[17px] leading-7 text-fg-2">
        The page you are looking for doesn’t exist or has been moved. Try one of these instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Go home
        </Link>
        <Link href="/wallpapers" className="btn-secondary">
          Browse wallpapers
        </Link>
      </div>
    </section>
  );
}
