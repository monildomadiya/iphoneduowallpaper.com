// Remounts on every admin navigation, so each screen eases in instead of snapping.
export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
