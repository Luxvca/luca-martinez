import PageLayout from "@/components/PageLayout";
import VideoGrid from "@/components/VideoGrid";
import { videosBySection } from "@/data/videos";

export const metadata = {
  title: "Music Videos | Luca Martinez"
};

export default function MusicVideosPage() {
  return (
    <PageLayout
      currentPath="/music-videos"
      eyebrow="Performance"
      title="Music Videos"
      description="Visual worlds built around rhythm, silhouette, and performance, with room for texture and negative space."
    >
      <VideoGrid items={videosBySection.musicVideos} />
    </PageLayout>
  );
}
