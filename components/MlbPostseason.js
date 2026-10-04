import Image from "next/image";
import localFont from "next/font/local";
import InstagramEmbed from "@/components/InstagramEmbed";
import PosterHeader from "@/components/PosterHeader";

const azeret = localFont({
  src: "../app/fonts/AzeretMono-variable.ttf",
  variable: "--font-azeret",
  weight: "100 900",
  display: "swap"
});

const rounds = [
  { stage: "Wildcard", alt: "No time like the Wildcard — Bryce Harper against the campaign's blue background." },
  { stage: "Divisional", alt: "No time like the Divisional Series — every inning, pitch and swing matters." },
  { stage: "Championship", alt: "No time like the Championship Series — time for dreams to come true or turn into heartbreak." },
  { stage: "World Series", alt: "No time like the World Series — time can stand still, speed up, or disappear completely." }
];

function CampaignImage({ src, alt }) {
  return (
    <figure className="mlb-frame">
      <Image src={src} alt={alt} width={1920} height={1080} sizes="100vw" unoptimized className="block h-auto w-full" />
    </figure>
  );
}

export default function MlbPostseason({ project }) {
  return (
    <main className={`poster project-page mlb-page ${azeret.variable}`}>
      <PosterHeader homeButton />
      <header className="mlb-intro mlb-inset">
        <div className="mlb-heading">
          <p className="mlb-eyebrow">MLB Postseason</p>
          <h1><span>No Time Like</span><span>October</span></h1>
          <div className="mlb-project-meta">
            <p>Agency: Wasserman</p>
            <p>Role: Assistant Editor / Junior Producer</p>
          </div>
        </div>
        <div className="mlb-premise">
          <p>Every postseason campaign talks about legacy.</p>
          <p>Every postseason campaign talks about stakes.</p>
          <p>But what makes October different is that time stops behaving normally.</p>
        </div>
      </header>

      <CampaignImage src={project.stills[0]} alt="I love October — the Wildcard campaign title on a blue background." />

      <section className="mlb-film mlb-inset" aria-label="MLB Postseason campaign film">
        <InstagramEmbed url={project.embedUrl} title="Watch No Time Like October on Instagram" />
      </section>

      <section className="mlb-contribution mlb-inset" aria-labelledby="mlb-role-heading">
        <h2 id="mlb-role-heading">My role</h2>
        <div>
          <p>As an assistant editor, I picked up the footage shipped by MLB and sorted through 11 TB of material, organizing the footage and choosing selects for the edit.</p>
          <p>As a junior producer, I helped hire an editor who had worked on <em>Moneyball</em> and joined client and internal meetings to discuss project scope, deliverables, timelines and budgets.</p>
        </div>
      </section>

      <CampaignImage src={project.stills[1]} alt="The October journey: Wildcard urgency, Divisional unrivaled experience, Championship high stakes, and World Series no rules." />

      <section className="mlb-music mlb-inset" aria-labelledby="mlb-music-heading">
        <div>
          <h2 id="mlb-music-heading">Music:</h2>
          <div className="mlb-music-track">
            <span className="mlb-track-source">From the movie <em>Moneyball</em></span>
            <strong>“The Mighty Rio Grande”</strong>
            <span className="mlb-track-artist">Artist: This Will Destroy You</span>
          </div>
        </div>
        <div>
          <p>The Moneyball score serves as our connective tissue, bringing familiarity while carrying our message.</p>
          <p>We found a song that immediately communicates baseball.</p>
        </div>
      </section>

      <section aria-label="Postseason rounds">
        {rounds.map((round, index) => (
          <CampaignImage key={round.stage} src={project.stills[index + 2]} alt={round.alt} />
        ))}
      </section>
    </main>
  );
}
