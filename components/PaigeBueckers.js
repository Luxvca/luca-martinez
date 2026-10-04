import Image from "next/image";
import localFont from "next/font/local";
import InstagramEmbed from "@/components/InstagramEmbed";
import PosterHeader from "@/components/PosterHeader";
import TweetEmbed from "@/components/TweetEmbed";

const azeret = localFont({ src: "../app/fonts/AzeretMono-variable.ttf", variable: "--font-azeret", weight: "100 900", display: "swap" });

function FullWidthImage({ src, alt }) {
  return <figure className="paige-frame"><Image src={src} alt={alt} width={2400} height={1600} sizes="100vw" unoptimized className="block h-auto w-full" /></figure>;
}

function OpeningImage({ src, alt }) {
  return <figure className="paige-opening-frame"><Image src={src} alt={alt} width={1600} height={2000} sizes="(max-width: 767px) 100vw, 33.333vw" unoptimized className="paige-opening-image" /></figure>;
}

function InlineImage({ src, alt }) {
  return <figure className="paige-inline-frame"><Image src={src} alt={alt} width={1200} height={1600} sizes="(max-width: 767px) 100vw, 33.333vw" unoptimized className="paige-opening-image" /></figure>;
}

export default function PaigeBueckers({ project }) {
  return (
    <main className={`poster project-page paige-page ${azeret.variable}`}>
      <PosterHeader
        homeButton
      />
      <header className="paige-intro paige-inset">
        <div>
          <p className="paige-eyebrow">Gatorade · Nike Capsule Collab</p>
          <h1>
            <span>Shirley Temple</span>{" "}
            <span className="paige-title-brand">
              Gatorade
              <Image src="/images/Gatorade-Paige-Bueckers/Gatorade-Logo-2020.png" alt="" width={150} height={84} sizes="150px" unoptimized className="paige-title-logo" />
            </span>
          </h1>
          <p className="paige-subtitle">{project.subheadline}</p>
          <p className="paige-service">{project.serviceLine}</p>
          <div className="paige-meta"><p>Agency: {project.agency}</p><p>Role: {project.role}</p></div>
        </div>
        <p className="paige-description">{project.description}</p>
      </header>

      <section className="paige-opening" aria-label="Campaign photography">
        <OpeningImage src={project.stills[0]} alt={`${project.title} — Look What You Made Us Do`} />
        <OpeningImage src={project.heroImage} alt={`${project.title} — She's Back`} />
        <OpeningImage src={project.stills[project.stills.length - 1]} alt={`${project.title} — final still`} />
      </section>

      {project.pullQuote ? <p className="paige-quote paige-inset">{project.pullQuote}</p> : null}
      {project.tweetUrl ? <div className="paige-tweet paige-inset"><TweetEmbed url={project.tweetUrl} /></div> : null}

      <section className="paige-embed paige-inset" aria-label="Campaign social film">
        <InstagramEmbed url={project.embedUrl} title={project.headline} />
      </section>

      <section className="paige-secondary-images paige-inset" aria-label="Additional campaign photography">
        <InlineImage src={project.stills[1]} alt={`${project.title} still 2`} />
        <InlineImage src={project.stills[3]} alt={`${project.title} still 4`} />
      </section>

      <p className="paige-role-writeup paige-inset"><strong>My role:</strong> Junior Producer. I supported the production and helped shape the campaign’s social deliverables from concept through launch. The Gatorade glassware was a real physical glass that I had etched at a custom glass engraving spot in Portland. I also managed the customization process from design through finished piece.</p>

      <section className="paige-secondary-embed paige-inset" aria-label="Additional campaign social film">
        <InstagramEmbed url="https://www.instagram.com/p/DbqoFC7NNbT/" title={`${project.headline} additional social film`} />
      </section>

      <FullWidthImage src={project.stills[2]} alt={`${project.title} still 3`} />

      {project.firstStillCaption ? <p className="paige-caption paige-inset">{project.firstStillCaption}</p> : null}
    </main>
  );
}
