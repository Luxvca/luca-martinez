"use client";

import { useState } from "react";
import Image from "next/image";
import LightLeak from "@/components/LightLeak";
import DebossTitle, { DEBOSS_DEFAULTS } from "@/components/DebossTitle";
import { videosBySection } from "@/data/videos";

const projects = videosBySection.commercials.filter(project => !project.thumbnail.includes("placeholder-frame.svg"));
const controls = [
  ["depth", "Depth (px)", 0, 2.5, .05],
  ["wall", "Wall width (px, locally clamped)", .2, 4, .05],
  ["softness", "Edge softness (px)", .3, 1.2, .05],
  ["angle", "Light angle (225° = top left)", 0, 360, 1],
  ["altitude", "Light altitude", 10, 80, 1],
  ["highlight", "Highlight", 0, 1, .01],
  ["shadow", "Shadow", 0, 1, .01],
  ["castShadow", "Cast shadow length (px)", 0, 6, .1],
  ["ao", "Ambient occlusion", 0, .5, .01],
  ["tint", "Recessed blue fill", 0, .5, .01],
  ["thickness", "Stroke thickness", 1, 2, .025],
];

export default function DebossLab() {
  const [values, setValues] = useState(DEBOSS_DEFAULTS);
  const [preview, setPreview] = useState(false);
  const [selected, setSelected] = useState(projects[0]?.slug);
  return <main className="deboss-lab">
    <LightLeak />
    <section className="deboss-lab-controls" aria-label="Deboss controls">
      <h1>Luca Martinez — title lab</h1>
      <p>Current homepage type, project list, and animated background. Shared recessed style for the project titles and name.</p>
      <div className="deboss-lab-sliders">{controls.map(([key, label, min, max, step]) => <label key={key}>
        <span>{label} <output>{Number(values[key].toFixed(3))}</output></span>
        <input type="range" min={min} max={max} step={step} value={values[key]} onChange={event => setValues(current => ({ ...current, [key]: Number(event.target.value) }))} />
      </label>)}</div>
      <div className="deboss-lab-options">
        <label><input type="checkbox" checked={preview} onChange={event => setPreview(event.target.checked)} /> Show hover preview (50% highlights)</label>
        <label>Preview project <select value={selected} onChange={event => setSelected(event.target.value)}>{projects.map(project => <option key={project.slug} value={project.slug}>{project.title}</option>)}</select></label>
        <button type="button" onClick={() => setValues(DEBOSS_DEFAULTS)}>Reset</button>
      </div>
      <details><summary>Copy chosen defaults</summary><pre>{JSON.stringify(values, null, 2)}</pre></details>
    </section>
    <section className="deboss-lab-stage section-grid" aria-label="Real project titles">
      <div>
      <p className="poster-name" style={{ marginBottom: 28 }}><DebossTitle word="Luca Martinez" className="deboss-brand" {...values} /></p>
      <div className="project-list">{projects.map(project => <span className="project-link" key={project.slug}>
        <span className="preview deboss-lab-preview" data-visible={preview && selected === project.slug ? "true" : undefined} aria-hidden="true"><Image src={project.thumbnail} alt="" fill sizes="81vw" style={{ objectPosition: project.previewPosition }} /></span>
        <DebossTitle word={project.title} className="project-title" {...values} />
      </span>)}</div></div>
    </section>
  </main>;
}
