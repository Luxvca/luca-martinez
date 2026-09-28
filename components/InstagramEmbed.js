"use client";

import { useEffect } from "react";

export default function InstagramEmbed({ url, title }) {
  const permalink = url.split("?")[0];

  useEffect(() => {
    const process = () => window.instgrm?.Embeds?.process();

    if (window.instgrm) {
      process();
      return;
    }

    // embed.js loads async in the document head, so it may not be ready on mount.
    const script = document.querySelector('script[src*="instagram.com/embed.js"]');
    script?.addEventListener("load", process);

    return () => script?.removeEventListener("load", process);
  }, [url]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={permalink}
      data-instgrm-version="14"
      style={{ margin: 0, width: "100%", maxWidth: "540px" }}
    >
      <a href={permalink} target="_blank" rel="noreferrer">
        {title}
      </a>
    </blockquote>
  );
}
