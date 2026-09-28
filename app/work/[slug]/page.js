import Image from "next/image";
import { notFound } from "next/navigation";

import InstagramEmbed from "@/components/InstagramEmbed";
import PageHeader from "@/components/PageHeader";
import TweetEmbed from "@/components/TweetEmbed";
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
        <div className="section-grid pb-10 pt-3 md:pb-12 md:pt-4">
          <div className="grid gap-8">
            <aside
              className={
                video.headline
                  ? "grid gap-6"
                  : "grid gap-6 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:gap-12"
              }
            >
              <div className={video.headline ? "text-center" : undefined}>
                {video.headline ? (
                  <>
                    <div className="mb-2 space-y-0.5 text-right text-[10px] uppercase tracking-editorial text-muted md:text-[11px]">
                      {video.agency ? <p>Agency: {video.agency}</p> : null}
                      {video.role ? <p>Role: {video.role}</p> : null}
                      {video.year ? <p>{video.year}</p> : null}
                    </div>
                    <h1 className="text-[clamp(43.2px,5.04vw,72px)] font-bold uppercase leading-[1.05] text-foreground">
                      {video.headline}
                    </h1>
                    {video.subheadline ? (
                      <p className="mt-3 text-[13px] uppercase tracking-editorial text-muted md:text-sm">
                        {video.subheadline}
                      </p>
                    ) : null}
                    {video.serviceLine ? (
                      <p className="mt-2 text-[13px] uppercase tracking-editorial text-muted md:text-sm">
                        {video.serviceLine}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className="text-[11px] uppercase tracking-editorial text-muted md:text-xs">
                      {video.category}
                    </p>
                    <h1 className="mt-4 text-[14px] font-medium uppercase leading-[1.5] tracking-[0.14em] text-foreground md:text-[16px]">
                      {video.title}
                    </h1>
                  </>
                )}
                {video.headline ? null : (
                  <div className="mt-4 space-y-1 text-sm leading-7 text-muted">
                    {video.agency ? <p>Agency: {video.agency}</p> : null}
                    {video.role ? <p>Role: {video.role}</p> : null}
                    {video.year ? <p>{video.year}</p> : null}
                  </div>
                )}
              </div>
              <div
                className={`space-y-4 text-sm leading-7 text-muted ${
                  video.headline ? "text-center" : ""
                }`}
              >
                <p
                  className={
                    video.headline
                      ? "mx-auto max-w-6xl text-xl font-semibold leading-8 text-foreground md:text-2xl md:leading-10"
                      : "max-w-2xl"
                  }
                >
                  {video.description}
                </p>
                {video.links?.map((link) => (
                  <p key={link.href}>
                    <a
                      className="text-foreground transition-opacity hover:opacity-70"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  </p>
                ))}
                {video.credits?.map((credit) => (
                  <p key={credit}>{credit}</p>
                ))}
              </div>
            </aside>

            <div className="flex flex-col gap-4 md:gap-5">
              {video.heroImage && video.embedUrl.includes("instagram.com") ? (
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:justify-center sm:gap-5">
                  <div className="flex w-full justify-center sm:w-auto">
                    <Image
                      src={video.heroImage}
                      alt={video.title}
                      width={1751}
                      height={2192}
                      sizes="(max-width: 640px) 100vw, 45vw"
                      className="h-auto w-full max-w-[540px] sm:h-full sm:w-auto sm:max-w-none"
                    />
                  </div>
                  <div className="w-full sm:max-w-[540px] sm:flex-1">
                    <InstagramEmbed url={video.embedUrl} title={video.title} />
                  </div>
                </div>
              ) : video.embedUrl.includes("instagram.com") ? (
                <div className="flex justify-center">
                  <InstagramEmbed url={video.embedUrl} title={video.title} />
                </div>
              ) : (
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
              )}

              {video.secondImage ? (
                <div className="mx-auto w-full max-w-4xl overflow-hidden bg-[#101010]">
                  <Image
                    src={video.secondImage}
                    alt={video.title}
                    width={3000}
                    height={2250}
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="h-auto w-full"
                  />
                </div>
              ) : null}

              {video.pullQuote ? (
                <p className="mx-auto mt-6 max-w-3xl text-center text-xl font-semibold leading-8 text-foreground md:mt-10 md:text-2xl md:leading-10">
                  {video.pullQuote}
                </p>
              ) : null}

              {video.tweetUrl ? <TweetEmbed url={video.tweetUrl} /> : null}
            </div>
          </div>

          {stills.length ? (
            <div className="mx-auto mt-6 grid max-w-2xl gap-4 md:mt-8 md:gap-5">
              {stills.map((still, index) => (
                <div key={`${still}-${index}`}>
                  <div className="overflow-hidden bg-[#101010]">
                    <Image
                      src={still}
                      alt={`${video.title} still ${index + 1}`}
                      width={1200}
                      height={900}
                      sizes="(max-width: 768px) 100vw, 672px"
                      className="h-auto w-full"
                    />
                  </div>
                  {index === 0 && video.firstStillCaption ? (
                    <p className="mt-3 text-sm leading-6 text-muted">
                      {video.firstStillCaption}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
