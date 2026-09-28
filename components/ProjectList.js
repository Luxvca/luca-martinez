"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

const EDGE = 16;

function ProjectName({ project }) {
  const previewRef = useRef(null);

  const hide = useCallback(() => {
    previewRef.current?.removeAttribute("data-visible");
  }, []);

  const moveTo = useCallback((x, y) => {
    const preview = previewRef.current;

    // When the preview is larger than the viewport the bounds invert, so it is allowed to
    // overflow rather than being pinned to one corner.
    const limitX = window.innerWidth - preview.offsetWidth - EDGE;
    const limitY = window.innerHeight - preview.offsetHeight - EDGE;
    const clampedX = Math.min(Math.max(x, Math.min(EDGE, limitX)), Math.max(EDGE, limitX));
    const clampedY = Math.min(Math.max(y, Math.min(EDGE, limitY)), Math.max(EDGE, limitY));

    preview.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
  }, []);

  const track = useCallback(
    (event) => {
      if (event.pointerType === "touch") return;

      const preview = previewRef.current;
      const holdStill =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        preview.dataset.visible === "true";

      if (!holdStill) {
        moveTo(event.clientX - preview.offsetWidth / 2, event.clientY - preview.offsetHeight / 2);
      }

      preview.dataset.visible = "true";
    },
    [moveTo]
  );

  const showAtCorner = useCallback(
    (event) => {
      if (!event.target.matches(":focus-visible")) return;

      const bounds = event.target.getBoundingClientRect();
      moveTo(bounds.right, bounds.top);
      previewRef.current.dataset.visible = "true";
    },
    [moveTo]
  );

  useEffect(() => {
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("resize", hide);
    window.addEventListener("blur", hide);

    return () => {
      window.removeEventListener("scroll", hide);
      window.removeEventListener("resize", hide);
      window.removeEventListener("blur", hide);
    };
  }, [hide]);

  return (
    <Link
      href={`/work/${project.slug}`}
      aria-label={`View ${project.title}`}
      className="project-link"
      onPointerEnter={track}
      onPointerMove={track}
      onPointerLeave={hide}
      onFocus={showAtCorner}
      onBlur={hide}
      onClick={hide}
    >
      <span className="preview" aria-hidden="true" ref={previewRef}>
        <Image
          src={project.thumbnail}
          alt=""
          fill
          sizes="(max-width: 768px) 81vw, 1260px"
          style={{ objectPosition: project.previewPosition }}
        />
      </span>
      <span className="project-title">{project.title}</span>
    </Link>
  );
}

export default function ProjectList({ projects }) {
  return (
    <div className="project-list">
      {projects.map((project) => (
        <ProjectName key={project.slug} project={project} />
      ))}
    </div>
  );
}
