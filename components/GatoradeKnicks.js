import Image from "next/image";
import localFont from "next/font/local";
import InstagramEmbed from "@/components/InstagramEmbed";
import PosterHeader from "@/components/PosterHeader";

const azeret = localFont({ src: "../app/fonts/AzeretMono-variable.ttf", variable: "--font-azeret", weight: "100 900", display: "swap" });

function CampaignImage({ src, alt, className = "" }) {
  return (
    <figure className={`knicks-frame ${className}`}>
      <Image src={src} alt={alt} width={2400} height={1800} sizes="100vw" unoptimized className="block h-auto w-full" />
    </figure>
  );
}

export default function GatoradeKnicks({ project }) {
  const opening = [project.stills[0], project.heroImage, project.stills.at(-1)];
  const remaining = project.stills.slice(1, -1);

  return (
    <main className={`poster project-page knicks-page ${azeret.variable}`}>
      <PosterHeader homeButton />
      <header className="knicks-intro knicks-inset">
        <div className="knicks-heading">
          <p className="knicks-eyebrow">Gatorade · NBA Finals · NEW YORK KNICKS</p>
          <h1 className="knicks-title">
            <span className="sr-only">IS IT IN YOU?</span>
            <Image src="/images/Gatorade-Knicks/is-it-in-you-transparent.svg" alt="Is it in you?" width={716} height={422} sizes="(max-width: 767px) 100vw, 55vw" unoptimized className="knicks-title-art" />
          </h1>
          <div className="knicks-meta"><p>Agency: {project.agency}</p><p>Role: {project.role}</p></div>
        </div>
        <div className="knicks-blurb">
          <Image src="/images/Gatorade-Knicks/New_York_Knicks_logo.svg" alt="New York Knicks" width={220} height={110} sizes="220px" unoptimized className="knicks-team-logo" />
          <p className="knicks-description">{project.description}</p>
        </div>
      </header>

      <section className="knicks-opening" aria-label="Campaign photography">
        {opening.map((src, index) => <CampaignImage key={`${src}-${index}`} src={src} alt={`${project.title} campaign image ${index + 1}`} />)}
      </section>

      <section className="knicks-embed knicks-inset" aria-label="Campaign social film">
        <InstagramEmbed url={project.embedUrl} title={project.headline} />
      </section>

      {remaining.map((src, index) => src === "/images/Gatorade-Knicks/T.jpg" ? (
        <section key={src} className="knicks-embed knicks-inset" aria-label="Talk of the Towns Instagram post">
          <InstagramEmbed url="https://www.instagram.com/p/DZjQBqjNYoI/" title="Talk of the Towns" />
        </section>
      ) : <CampaignImage key={`${src}-${index}`} src={src} alt={`${project.title} campaign image ${index + 4}`} />)}
    </main>
  );
}
