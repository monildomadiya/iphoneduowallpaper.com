"use client";

/**
 * Runs during HTML parsing on the server-rendered page, and stays inert (type="text/plain")
 * if React ever renders it on the client, which avoids React's script-tag warning.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
