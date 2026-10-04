import Image from "next/image";
import localFont from "next/font/local";
import PosterHeader from "@/components/PosterHeader";
import InstagramEmbed from "@/components/InstagramEmbed";
import { getEmbedUrl } from "@/data/videos";

const azeret = localFont({ src: "../app/fonts/AzeretMono-variable.ttf", variable: "--font-azeret", weight: "100 900", display: "swap" });

export default function DirectorProject({ project }) {
  const stills = (project.stills || []).filter((src) => !src.includes("placeholder-frame.svg"));
  const amerikid = project.slug.startsWith("amerikid-");
  const credits = [
    { role: "Creative Director", name: "Luca Martinez" },
    ...(amerikid ? [{ role: "Creative Director", name: "Will Coleman" }] : []),
    ...(project.slug === "amerikid-dress-code" ? [{ role: "Producer", name: "Harrison Allen" }] : [])
  ];

  return (
    <main className={`poster project-page director-page ${azeret.variable}`}>
      <PosterHeader homeButton />
      <header className="director-intro director-inset">
        <div>
          <p className="director-eyebrow">{project.category}{project.year ? ` · ${project.year}` : ""}</p>
          <h1>{project.headline || project.title}</h1>
          <p className="director-role">Role: Director</p>
        </div>
        <div className="director-description">
          {project.description?.split("\n\n").map((text) => <p key={text}>{text}</p>)}
          {project.links?.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}
        </div>
      </header>
      {project.embedUrl?.includes("instagram.com") ? (
        <section className="director-social director-inset" aria-label="Project film"><InstagramEmbed url={project.embedUrl} title={project.title} /></section>
      ) : project.embedUrl ? (
        <section className="director-film" aria-label="Project film">
          <iframe src={getEmbedUrl(project.embedUrl)} title={project.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </section>
      ) : null}
      {stills.map((src, index) => (
        <figure className="director-frame" key={`${src}-${index}`}>
          <Image src={src} alt={`${project.title} — still ${index + 1}`} width={2400} height={1600} sizes="100vw" unoptimized className="block h-auto w-full" />
        </figure>
      ))}
      {project.slug !== "built-for-the-city-alpine-stars" ? (
        <section className="director-credits director-inset" aria-labelledby="director-credits-heading">
          <h2 id="director-credits-heading">Credits</h2>
          <dl>{credits.map(({ role, name }) => <div key={`${role}-${name}`}><dt>{role}:</dt><dd>{name}</dd></div>)}</dl>
        </section>
      ) : null}
    </main>
  );
}
