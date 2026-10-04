import Link from "next/link";
import DebossTitle from "@/components/DebossTitle";

export default function PosterHeader({ currentPath, homeButton = false, centerContent = null }) {
  return (
    <header className="poster-header section-grid flex items-start justify-between gap-6 py-5 md:py-7">
      {homeButton ? <Link href="/" className="project-home">Home</Link> : <div>
        <Link href="/" className="poster-name inline-block" aria-label="Luca Martinez — home">
          <DebossTitle word="Luca Martinez" className="deboss-brand" />
        </Link>
        <p className="poster-sub mt-2 text-[11px] uppercase tracking-editorial md:text-xs">
          Director-Producer
        </p>
      </div>}
      {centerContent ? <div className="poster-header-center">{centerContent}</div> : null}
      <nav aria-label="Main navigation" className="flex gap-5 text-[11px] uppercase tracking-editorial md:text-xs">
        {!homeButton && <Link href="/" className="poster-sub">Work</Link>}
        <Link href="/contact" aria-current={currentPath === "/contact" ? "page" : undefined} className="poster-sub">About</Link>
      </nav>
    </header>
  );
}
