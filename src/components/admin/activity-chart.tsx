import { formatNumber } from "@/lib/utils";

interface Point {
  day: string;
  downloads: number;
  views: number;
}

/** Lightweight SVG chart: bars = downloads, line = views. */
export function ActivityChart({ series }: { series: Point[] }) {
  if (!series.length) {
    return <p className="py-16 text-center text-[14px] text-fg-3">No activity recorded yet.</p>;
  }

  const width = 720;
  const height = 220;
  const padding = { top: 12, right: 8, bottom: 26, left: 8 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const maxDownloads = Math.max(1, ...series.map((point) => point.downloads));
  const maxViews = Math.max(1, ...series.map((point) => point.views));
  const step = innerW / series.length;
  const barW = Math.max(2, step * 0.56);

  const linePoints = series
    .map((point, index) => {
      const x = padding.left + step * index + step / 2;
      const y = padding.top + innerH - (point.views / maxViews) * innerH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const labelEvery = Math.ceil(series.length / 6);
  const totals = series.reduce(
    (sum, point) => ({ downloads: sum.downloads + point.downloads, views: sum.views + point.views }),
    { downloads: 0, views: 0 },
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-6 text-[13px]">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-accent" />
          Downloads <strong className="font-semibold">{formatNumber(totals.downloads)}</strong>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-3 rounded-full bg-[#bf5af2]" />
          Views <strong className="font-semibold">{formatNumber(totals.views)}</strong>
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Downloads and views for the last 30 days">
        {[0.25, 0.5, 0.75, 1].map((fraction) => (
          <line
            key={fraction}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + innerH * (1 - fraction)}
            y2={padding.top + innerH * (1 - fraction)}
            className="stroke-line"
            strokeWidth={1}
          />
        ))}
        {series.map((point, index) => {
          const barH = (point.downloads / maxDownloads) * innerH;
          const x = padding.left + step * index + (step - barW) / 2;
          const date = new Date(`${point.day}T00:00:00Z`);
          const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
          return (
            <g key={point.day}>
              <rect x={x} y={padding.top + innerH - barH} width={barW} height={Math.max(barH, point.downloads ? 2 : 0)} rx={2} className="fill-accent">
                <title>{`${label}: ${point.downloads} downloads, ${point.views} views`}</title>
              </rect>
              {index % labelEvery === 0 ? (
                <text x={padding.left + step * index + step / 2} y={height - 6} textAnchor="middle" className="fill-fg-3 text-[11px]">
                  {label}
                </text>
              ) : null}
            </g>
          );
        })}
        <polyline points={linePoints} fill="none" stroke="#bf5af2" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}
