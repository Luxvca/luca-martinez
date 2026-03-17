import PageLayout from "@/components/PageLayout";
import VideoGrid from "@/components/VideoGrid";
import { videosBySection } from "@/data/videos";

export const metadata = {
  title: "Commercials | Luca Martinez"
};

export default function CommercialsPage() {
  return (
    <PageLayout
      currentPath="/commercials"
      eyebrow="Commercial"
      title="Commercials"
      description="Short-form campaign work focused on atmosphere, material detail, and controlled pacing."
    >
      <VideoGrid items={videosBySection.commercials} />
    </PageLayout>
  );
}
