import PageLayout from "@/components/PageLayout";
import VideoGrid from "@/components/VideoGrid";
import { videosBySection } from "@/data/videos";

export const metadata = {
  title: "Social | Luca Martinez"
};

export default function SocialPage() {
  return (
    <PageLayout
      currentPath="/social"
      eyebrow="Social"
      title="Social"
      description="Short-form social content and music videos."
    >
      <div className="space-y-12 md:space-y-16">
        <VideoGrid items={videosBySection.social} />

        <div className="space-y-5">
          <h2 className="text-[11px] uppercase tracking-editorial text-muted md:text-xs">
            Music Videos
          </h2>
          <VideoGrid items={videosBySection.musicVideos} />
        </div>
      </div>
    </PageLayout>
  );
}
