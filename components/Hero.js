import Image from "next/image";
import Link from "next/link";

import VideoGrid from "@/components/VideoGrid";
import { navigationLinks } from "@/data/navigation";
import { getVideoBySlug, videosBySection } from "@/data/videos";

const slices = [
  { video: getVideoBySlug("nike-get-lost"), position: "object-[center_62%]" },
  { video: getVideoBySlug("built-for-the-city-alpine-stars"), position: "object-[center_27%]" },
  { video: getVideoBySlug("morocco"), position: "object-[center_62%]" }
];

export default function Hero() {
  return (
    <section className="bg-background">
      <header className="section-grid grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-5 text-[11px] font-medium uppercase tracking-[0.12em] md:py-7 md:text-base md:tracking-[0.35em]">
        <p className="text-foreground">Luca Martinez</p>
        <p className="text-muted">Director/Editor</p>
      </header>

      <div className="flex flex-col gap-1.5 sm:gap-2">
        {slices.map(({ video, position }) => (
          // Height scales with width so the crop stays on the eyes at every screen size.
          <Link
            key={video.slug}
            href={`/work/${video.slug}`}
            aria-label={video.title}
            className="relative block h-[13vw] min-h-[56px] w-full overflow-hidden transition-opacity duration-300 hover:opacity-80"
          >
            <Image
              src={video.thumbnail}
              alt=""
              fill
              priority
              sizes="100vw"
              className={`object-cover ${position}`}
            />
          </Link>
        ))}
      </div>

      <nav className="section-grid flex flex-wrap justify-center gap-x-6 gap-y-2 py-5 text-[11px] uppercase tracking-editorial text-muted md:py-7 md:text-xs">
        {navigationLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-foreground"
          >
            <span className="inline-block h-2.5 w-2.5 shrink-0 bg-red-600" />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="section-grid pb-10 md:hidden">
        <VideoGrid items={videosBySection.selectedWork} />
      </div>
    </section>
  );
}
