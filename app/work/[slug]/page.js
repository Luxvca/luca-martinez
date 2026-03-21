import Image from "next/image";
import { notFound } from "next/navigation";

import PageHeader from "@/components/PageHeader";
import { allVideos, getEmbedUrl, getVideoBySlug } from "@/data/videos";

export async function generateStaticParams() {
  return allVideos.map((video) => ({
    slug: video.slug
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const video = getVideoBySlug(resolvedParams.slug);

  if (!video) {
    return {};
  }

  return {
    title: `${video.title} | Luca Martinez`
  };
}

export default async function WorkDetailPage({ params }) {
  const resolvedParams = await params;
  const video = getVideoBySlug(resolvedParams.slug);

  if (!video) {
    notFound();
  }

  const stills = (video.stills || []).filter((still) => !still.includes("placeholder-frame.svg"));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageHeader currentPath={`/${video.category.toLowerCase().replace(/\s+/g, "-")}`} />
      <section className="section-rule">
        <div className="section-grid py-10 md:py-12">
          <div className="grid gap-8 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-8">
            <aside className="space-y-6 xl:self-start">
              <div>
                <p className="text-[11px] uppercase tracking-editorial text-muted md:text-xs">
                  {video.category}
                </p>
                <h1 className="mt-4 text-[14px] font-medium uppercase leading-[1.5] tracking-[0.14em] text-foreground md:text-[16px]">
                  {video.title}
                </h1>
              </div>
              <div className="space-y-4 text-sm leading-7 text-muted">
                {video.year ? <p>{video.year}</p> : null}
                <p>{video.description}</p>
                {video.credits?.map((credit) => (
                  <p key={credit}>{credit}</p>
                ))}
              </div>
            </aside>

            <div className="overflow-hidden bg-black">
              <div className="aspect-video">
                <iframe
                  src={getEmbedUrl(video.embedUrl)}
                  title={video.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {stills.length ? (
            <div className="mt-6 grid gap-4 px-4 md:mt-8 md:gap-5 md:px-8">
              {stills.map((still, index) => (
                <div key={`${still}-${index}`} className="relative overflow-hidden bg-[#101010]">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={still}
                      alt={`${video.title} still ${index + 1}`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
