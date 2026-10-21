import type { Viewport } from "next";
import { RootDocument, rootMetadata, rootViewport } from "@/components/site/root-document";
import { SiteChrome } from "@/components/site/site-chrome";

export const generateMetadata = rootMetadata;
export const viewport: Viewport = rootViewport;

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <RootDocument lang="en">
      <SiteChrome>{children}</SiteChrome>
    </RootDocument>
  );
}
