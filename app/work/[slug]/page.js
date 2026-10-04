import Image from "next/image";
import { notFound } from "next/navigation";

import InstagramEmbed from "@/components/InstagramEmbed";
import MlbPostseason from "@/components/MlbPostseason";
import PaigeBueckers from "@/components/PaigeBueckers";
import GatoradeKnicks from "@/components/GatoradeKnicks";
import LightLeak from "@/components/LightLeak";
import PosterHeader from "@/components/PosterHeader";
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
    title: `${video.pageTitle || video.title} | Luca Martinez`
  };
}

export default async function WorkDetailPage({ params }) {
  const resolvedParams = await params;
  const video = getVideoBySlug(resolvedParams.slug);

  if (!video) {
    notFound();
  }

  if (video.slug === "mlb-postseason") {
    return <MlbPostseason project={video} />;
  }
  if (video.slug === "gatorade-paige-bueckers") {
    return <PaigeBueckers project={video} />;
  }
  if (video.slug === "gatorade-knicks") {
    return <GatoradeKnicks project={video} />;
  }

  const stills = (video.stills || []).filter((still) => !still.includes("placeholder-frame.svg"));
  const isNikeSpec = video.slug === "nike-get-lost";
  const featuredStill = isNikeSpec ? stills.at(-1) : null;
  const galleryStills = featuredStill ? stills.slice(0, -1) : stills;

  return (
    <main className={`poster project-page${isNikeSpec ? " nike-spec-page" : ""}`}>
      {!isNikeSpec && <LightLeak />}
      <PosterHeader homeButton />
      <section className="section-rule">
        <div className="section-grid pb-10 pt-3 md:pb-12 md:pt-4">
          <div className={isNikeSpec ? "nike-spec-intro" : "grid gap-8"}>
            {isNikeSpec ? (
              <>
                <div className="nike-spec-title">
                  <p className="nike-spec-label">Nike Spec Ad · {video.year}</p>
                  <h1>Get Lost</h1>
                  <span className="nike-spec-logo" role="img" aria-label="Nike" />
                  <div className="nike-spec-meta">
                    <p>Director: Luca Martinez &amp; Alec Lam</p>
                    <p>Production Company: Special Projects Group</p>
                  </div>
                </div>
                <aside className="project-copy nike-spec-details">
                  <div className="nike-spec-writeup">
                    {video.description.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </aside>
              </>
            ) : <aside
              className={
                video.headline
                  ? "project-copy grid gap-6"
                  : "project-copy grid gap-6 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:gap-12"
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
            </aside>}

            <div className={`flex flex-col gap-4 md:gap-5${isNikeSpec ? " nike-spec-film" : ""}`}>
              {featuredStill ? (
                <figure className="nike-spec-fullbleed">
                  <Image
                    src={featuredStill}
                    alt={`${video.title} still ${stills.length}`}
                    width={2560}
                    height={1350}
                    sizes="100vw"
                    className="block h-auto w-full"
                  />
                </figure>
              ) : null}
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
                <p className="project-copy mx-auto mt-6 max-w-3xl text-center text-xl font-semibold leading-8 text-foreground md:mt-10 md:text-2xl md:leading-10">
                  {video.pullQuote}
                </p>
              ) : null}

              {video.tweetUrl ? <TweetEmbed url={video.tweetUrl} /> : null}
            </div>
          </div>

          {galleryStills.length ? (
            <div className={isNikeSpec ? "nike-spec-gallery" : "mx-auto mt-6 grid max-w-2xl gap-4 md:mt-8 md:gap-5"}>
              {galleryStills.map((still, index) => (
                <div key={`${still}-${index}`} className={isNikeSpec ? "nike-spec-fullbleed" : undefined}>
                  <div className="overflow-hidden bg-[#101010]">
                    <Image
                      src={still}
                      alt={`${video.title} still ${index + 1}`}
                      width={1200}
                      height={900}
                      sizes={isNikeSpec ? "100vw" : "(max-width: 768px) 100vw, 672px"}
                      unoptimized={isNikeSpec}
                      className="h-auto w-full"
                    />
                  </div>
                  {index === 0 && video.firstStillCaption ? (
                    <p className="project-copy mt-3 text-sm leading-6 text-muted">
                      {video.firstStillCaption}
                    </p>
                  ) : null}
                  {index === 2 && video.socialEmbedUrl ? (
                    <div className="nike-spec-social">
                      <InstagramEmbed url={video.socialEmbedUrl} title={`${video.title} — Instagram film`} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {video.productionCredits?.length ? (
            <section className="project-copy nike-spec-credits" aria-labelledby="production-credits">
              <h2 id="production-credits">Credits</h2>
              <dl>
                {video.productionCredits.map(({ role, name }) => (
                  <div key={`${role}-${name}`}>
                    <dt>{role}:</dt>
                    <dd>{name}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
