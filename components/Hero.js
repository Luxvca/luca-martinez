import Link from "next/link";

import LightLeak from "@/components/LightLeak";
import ProjectList from "@/components/ProjectList";
import { navigationLinks } from "@/data/navigation";
import { videosBySection } from "@/data/videos";

const projects = videosBySection.commercials.filter(
  (project) => !project.thumbnail.includes("placeholder-frame.svg")
);

export default function Hero() {
  return (
    <section className="poster">
      <LightLeak />


      <header className="poster-header section-grid flex items-start justify-between gap-6 py-5 md:py-7">
        <div>
          <p className="poster-name">Luca Martinez</p>
          <p className="poster-sub mt-2 text-[11px] uppercase tracking-editorial md:text-xs">
            Director-Producer
          </p>
        </div>

        <nav className="flex items-center gap-x-5 text-[11px] uppercase tracking-editorial md:text-xs">
          {navigationLinks.map((link) => (
            <Link key={link.href} href={link.href} className="poster-sub whitespace-nowrap">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="section-grid poster-stage">
        <ProjectList projects={projects} />
      </div>
    </section>
  );
}
