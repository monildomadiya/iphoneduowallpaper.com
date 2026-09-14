export function safeAdminPath(value: unknown, fallback = "/admin"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/admin") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
