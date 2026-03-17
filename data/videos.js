// Update this file to add, remove, or reorder portfolio videos.
export const videosBySection = {
  selectedWork: [
    {
      slug: "afterlight",
      title: "Afterlight",
      thumbnail: "/images/placeholder-frame.svg",
      category: "Selected Work",
      description: "A moody fashion short built around controlled motion, tactile close-ups, and restrained pacing.",
      embedUrl: "https://player.vimeo.com/video/76979871",
      year: "2024",
      credits: ["Directed by Luca Martinez"],
      stills: ["/images/placeholder-frame.svg"]
    },
    {
      slug: "night-transit",
      title: "Night Transit",
      thumbnail: "/images/placeholder-frame.svg",
      category: "Selected Work",
      description: "Urban portraiture with a nocturnal palette, quiet tension, and editorial framing.",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      year: "2024",
      credits: ["Directed by Luca Martinez"],
      stills: ["/images/placeholder-frame.svg"]
    }
  ],
  commercials: [
    {
      slug: "pallet-introducing-atlas",
      title: "Pallet | Introducing Atlas",
      thumbnail: "/images/Pallet Atlas images/Pallet Thumbnail 2.png",
      category: "Commercial",
      description: "Commercial work for Pallet.",
      embedUrl: "https://www.youtube.com/watch?v=zmeO1dph1XY",
      year: "2026",
      credits: ["Directed by Luca Martinez"],
      stills: [
        "/images/Pallet Atlas images/Pallet image 1.png",
        "/images/Pallet Atlas images/Pallet image 2.png",
        "/images/Pallet Atlas images/Pallet image 3.png",
        "/images/Pallet Atlas images/Pallet Image 4.png",
        "/images/Pallet Atlas images/Pallet Image 5.png",
        "/images/Pallet Atlas images/Pallet Image 7.png"
      ]
    },
    {
      slug: "nbc-4-streetwear-story",
      title: "NBC 4 | Streetwear Story",
      thumbnail: "/images/NBC 4 Streetwear Images/NBC Image 10.png",
      category: "Commercial",
      description: "Commercial work for NBC 4.",
      embedUrl: "https://youtu.be/BwfqpUpZ38g",
      year: "2025",
      credits: ["Directed by Luca Martinez"],
      stills: [
        "/images/NBC 4 Streetwear Images/NBC Streetwear Thumbnail.png",
        "/images/NBC 4 Streetwear Images/NBC Image 11.png",
        "/images/NBC 4 Streetwear Images/NBC Image 9.png",
        "/images/NBC 4 Streetwear Images/NBC Image 8.png",
        "/images/NBC 4 Streetwear Images/NBC image 7.png",
        "/images/NBC 4 Streetwear Images/NBC Image 6.png",
        "/images/NBC 4 Streetwear Images/NBC Image 5.png",
        "/images/NBC 4 Streetwear Images/NBC Image 4.png",
        "/images/NBC 4 Streetwear Images/NBC Image 3.png",
        "/images/NBC 4 Streetwear Images/NBC Image 2.png",
        "/images/NBC 4 Streetwear Images/NBC image 1.png"
      ]
    },
    {
      slug: "built-for-the-city-alpine-stars",
      title: "ALPINE STARS - BUILT FOR THE CITY",
      thumbnail: "/images/Alpine Stars images/Alpine Stars Thumbnail 2.png",
      category: "Commercial",
      description: "Commercial work for Alpine Stars.",
      embedUrl: "https://www.youtube.com/watch?v=pDfboWKJ1WY",
      year: "2024",
      credits: ["Directed by Luca Martinez"],
      stills: [
        "/images/Alpine Stars images/Screenshot 2026-03-16 at 9.08.17 PM.png",
        "/images/Alpine Stars images/Screenshot 2026-03-16 at 9.09.16 PM.png",
        "/images/Alpine Stars images/Screenshot 2026-03-16 at 9.09.44 PM.png",
        "/images/Alpine Stars images/Screenshot 2026-03-16 at 9.10.40 PM.png"
      ]
    },
    {
      slug: "monochrome-run",
      title: "Monochrome Run",
      thumbnail: "/images/placeholder-frame.svg",
      category: "Commercial",
      description: "A sportswear launch spot focused on tempo, texture, and movement through shadow.",
      embedUrl: "https://player.vimeo.com/video/22439234",
      year: "2024",
      credits: ["Directed by Luca Martinez"],
      stills: ["/images/placeholder-frame.svg"]
    },
    {
      slug: "quiet-luxury",
      title: "Quiet Luxury",
      thumbnail: "/images/placeholder-frame.svg",
      category: "Commercial",
      description: "Minimal product storytelling anchored by precise light and intimate detail.",
      embedUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
      year: "2024",
      credits: ["Directed by Luca Martinez"],
      stills: ["/images/placeholder-frame.svg"]
    }
  ],
  musicVideos: [
    {
      slug: "static-bloom",
      title: "Static Bloom",
      thumbnail: "/images/placeholder-frame.svg",
      category: "Music Video",
      description: "Performance-led imagery with an austere visual language and slow-building atmosphere.",
      embedUrl: "https://player.vimeo.com/video/32720353",
      year: "2024",
      credits: ["Directed by Luca Martinez"],
      stills: ["/images/placeholder-frame.svg"]
    },
    {
      slug: "northbound",
      title: "Northbound",
      thumbnail: "/images/placeholder-frame.svg",
      category: "Music Video",
      description: "A drifting road piece shaped around silhouette, distance, and negative space.",
      embedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
      year: "2024",
      credits: ["Directed by Luca Martinez"],
      stills: ["/images/placeholder-frame.svg"]
    }
  ]
};

export function getEmbedUrl(url) {
  if (url.includes("youtube.com/embed") || url.includes("player.vimeo.com/video")) {
    return url;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtube.com/watch?v=")) {
    const id = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("vimeo.com/")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${id}`;
  }

  return url;
}

export const allVideos = Object.values(videosBySection).flat();

export function getVideoBySlug(slug) {
  return allVideos.find((video) => video.slug === slug);
}
