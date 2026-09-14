import type { Metadata } from "next";

// The admin area reads the session cookie on every request, so it is allowed to block.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-dvh bg-bg">{children}</div>;
}
