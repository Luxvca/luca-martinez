import PageLayout from "@/components/PageLayout";
import VideoGrid from "@/components/VideoGrid";
import { videosBySection } from "@/data/videos";

export const metadata = {
  title: "MV & Social | Luca Martinez"
};

export default function MusicVideosPage() {
  return (
    <PageLayout
      currentPath="/music-videos"
      eyebrow="Performance"
      title="MV & Social"
      description="Music videos and short-form social content built around rhythm, performance, and momentum."
    >
      <VideoGrid items={videosBySection.musicVideos} />
    </PageLayout>
  );
}
