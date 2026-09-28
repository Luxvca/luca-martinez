"use client";

import { useEffect, useState } from "react";

export default function TweetEmbed({ url }) {
  const id = url.match(/status\/(\d+)/)?.[1];
  const [height, setHeight] = useState(240);

  useEffect(() => {
    // X's embed reports its rendered height; matching it hides the frame's white backdrop.
    const onMessage = (event) => {
      if (!event.origin.includes("platform.twitter.com")) return;

      let data = event.data;

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      const reported = data?.["twttr.embed"]?.params?.[0]?.height;

      if (reported) {
        setHeight(reported);
      }
    };

    window.addEventListener("message", onMessage);

    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!id) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[550px] overflow-hidden rounded-2xl" style={{ height }}>
        <iframe
          src={`https://platform.twitter.com/embed/Tweet.html?id=${id}&theme=dark&dnt=true`}
          title="Post on X"
          scrolling="no"
          className="w-full border-0"
          style={{ height }}
        />
      </div>
    </div>
  );
}
