import PageHeader from "@/components/PageHeader";

export default function PageLayout({
  currentPath,
  eyebrow,
  title,
  description,
  children
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageHeader currentPath={currentPath} />
      <section className="section-rule">
        <div className="section-grid py-16 md:py-20">
          <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-editorial text-muted md:text-xs">
                {eyebrow}
              </p>
              <h1 className="mt-4 text-[26px] font-medium uppercase leading-none tracking-[0.14em] text-foreground md:text-[36px]">
                {title}
              </h1>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted md:text-base">
              {description}
            </p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
