import PageHeader from "@/components/PageHeader";

export default function PageLayout({
  currentPath,
  children
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageHeader currentPath={currentPath} />
      <section className="section-rule">
        <div className="section-grid py-10 md:py-12">
          {children}
        </div>
      </section>
    </main>
  );
}
