import type { Metadata, Viewport } from "next";
import { RootDocument, rootViewport } from "@/components/site/root-document";
import { siteUrl } from "@/lib/env";

// The admin area reads the session cookie on every request, so it is allowed to block.

export const viewport: Viewport = rootViewport;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
  // Added to an iPhone home screen, the panel opens full screen under its own name.
  appleWebApp: { capable: true, title: "Duo Admin", statusBarStyle: "default" },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <RootDocument lang="en">
      <div className="min-h-dvh bg-bg">{children}</div>
    </RootDocument>
  );
}
