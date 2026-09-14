"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  console.error(error);
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
          background: "#000",
          color: "#f5f5f7",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 40, margin: 0 }}>Something went wrong.</h1>
          <p style={{ color: "#a1a1a6", fontSize: 17 }}>Please refresh the page or try again later.</p>
          {/* A full page load resets the broken app state. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={{ color: "#2997ff", fontSize: 17 }}>
            Go to the homepage
          </a>
        </div>
      </body>
    </html>
  );
}
