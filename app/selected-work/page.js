import PageLayout from "@/components/PageLayout";
import VideoGrid from "@/components/VideoGrid";
import { videosBySection } from "@/data/videos";

export const metadata = {
  title: "Selected Work | Luca Martinez"
};

export default function SelectedWorkPage() {
  return (
    <PageLayout
      currentPath="/selected-work"
      eyebrow="Featured"
      title="Selected Work"
      description="A tightly edited set of narrative, branded, and music-driven pieces presented with the same quiet restraint as the landing page."
    >
      <VideoGrid items={videosBySection.selectedWork} />
    </PageLayout>
  );
}
