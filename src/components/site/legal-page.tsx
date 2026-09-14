import { LEGAL_LAST_UPDATED } from "@/lib/site";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function LegalPage({
  eyebrow = "Legal",
  title,
  intro,
  sections,
  updated = LEGAL_LAST_UPDATED,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  sections: LegalSection[];
  updated?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="container-apple">
      <header className="mx-auto max-w-5xl pb-10 pt-10 md:pt-16">
        <p className="text-[15px] font-semibold text-fg-2">{eyebrow}</p>
        <h1 className="headline-page mt-2 text-balance">{title}</h1>
        {updated ? <p className="mt-3 text-[15px] text-fg-3">Last updated: {updated}</p> : null}
        {intro ? <div className="mt-6 max-w-3xl text-[19px] leading-8 text-fg-2">{intro}</div> : null}
      </header>

      <div className="mx-auto grid max-w-5xl gap-10 border-t border-line pt-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-20">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-fg-3">On this page</p>
            <ol className="mt-3 space-y-2 text-[14px]">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-fg-2 hover:text-fg">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="prose-apple min-w-0 max-w-3xl">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <h2>{section.title}</h2>
              {section.content}
            </section>
          ))}
          {children}
        </div>
      </div>
    </div>
  );
}
