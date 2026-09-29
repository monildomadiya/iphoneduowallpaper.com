// Shown the moment an admin link is tapped, while the next screen loads.
export default function AdminLoading() {
  const block = "animate-pulse rounded-[22px] bg-line/60";
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="mb-6 sm:mb-8">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-line/70 md:h-10 md:w-64" />
        <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded-lg bg-line/50" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={`${block} h-24 sm:h-28`} />
        ))}
      </div>
      <div className={`${block} mt-4 h-64 sm:mt-6`} />
    </div>
  );
}
