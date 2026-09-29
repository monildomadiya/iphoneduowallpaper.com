import { formatNumber } from "@/lib/utils";

interface Point {
  day: string;
  downloads: number;
  views: number;
}

/**
 * Lightweight SVG chart: bars = downloads, line = views.
 * The plot stretches to its box and the date labels are HTML, so text stays readable on a phone.
 */
export function ActivityChart({ series }: { series: Point[] }) {
  if (!series.length) {
    return <p className="py-16 text-center text-[14px] text-fg-3">No activity recorded yet.</p>;
  }

  const width = 720;
  const height = 200;
  const padding = 8;
  const innerH = height - padding * 2;
  const maxDownloads = Math.max(1, ...series.map((point) => point.downloads));
  const maxViews = Math.max(1, ...series.map((point) => point.views));
  const step = width / series.length;
  const barW = Math.max(2, step * 0.56);

  const linePoints = series
    .map((point, index) => {
      const x = step * index + step / 2;
      const y = padding + innerH - (point.views / maxViews) * innerH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const labelEvery = Math.ceil(series.length / 5);
  const totals = series.reduce(
    (sum, point) => ({ downloads: sum.downloads + point.downloads, views: sum.views + point.views }),
    { downloads: 0, views: 0 },
  );
  const label = (day: string) =>
    new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:flex sm:gap-6">
        <div className="rounded-xl bg-surface px-3 py-2 sm:bg-transparent sm:p-0">
          <p className="flex items-center gap-2 text-[12px] text-fg-2 sm:text-[13px]">
            <span className="size-2.5 rounded-sm bg-accent" />
            Downloads
          </p>
          <p className="mt-0.5 text-[18px] font-semibold tabular-nums sm:text-[15px]">{formatNumber(totals.downloads)}</p>
        </div>
        <div className="rounded-xl bg-surface px-3 py-2 sm:bg-transparent sm:p-0">
          <p className="flex items-center gap-2 text-[12px] text-fg-2 sm:text-[13px]">
            <span className="h-0.5 w-3 rounded-full bg-[#bf5af2]" />
            Views
          </p>
          <p className="mt-0.5 text-[18px] font-semibold tabular-nums sm:text-[15px]">{formatNumber(totals.views)}</p>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="block h-40 w-full sm:h-52"
        role="img"
        aria-label="Downloads and views for the last 30 days"
      >
        {[0.25, 0.5, 0.75, 1].map((fraction) => (
          <line
            key={fraction}
            x1={0}
            x2={width}
            y1={padding + innerH * (1 - fraction)}
            y2={padding + innerH * (1 - fraction)}
            className="stroke-line"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {series.map((point, index) => {
          const barH = (point.downloads / maxDownloads) * innerH;
          return (
            <rect
              key={point.day}
              x={step * index + (step - barW) / 2}
              y={padding + innerH - barH}
              width={barW}
              height={Math.max(barH, point.downloads ? 2 : 0)}
              rx={2}
              className="fill-accent"
            >
              <title>{`${label(point.day)}: ${point.downloads} downloads, ${point.views} views`}</title>
            </rect>
          );
        })}
        <polyline
          points={linePoints}
          fill="none"
          stroke="#bf5af2"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative mt-1.5 h-4 text-[11px] text-fg-3" aria-hidden>
        {series.map((point, index) =>
          index % labelEvery === 0 ? (
            <span
              key={point.day}
              className="absolute -translate-x-1/2 whitespace-nowrap first:translate-x-0"
              style={{ left: `${((index + 0.5) / series.length) * 100}%` }}
            >
              {label(point.day)}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}
