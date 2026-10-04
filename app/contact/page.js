import Contact from "@/components/Contact";
import DebossTitle from "@/components/DebossTitle";
import LightLeak from "@/components/LightLeak";
import PosterHeader from "@/components/PosterHeader";

export const metadata = {
  title: "About | Luca Martinez"
};

export default function ContactPage() {
  return (
    <main className="poster about-page">
      <LightLeak />
      <PosterHeader currentPath="/contact" />
      <div className="section-grid about-stage">
        <section className="about-content" aria-labelledby="about-heading">
          <h1 id="about-heading" className="about-heading"><DebossTitle word="About" /></h1>
          <Contact compact themed />
        </section>
      </div>
    </main>
  );
}
