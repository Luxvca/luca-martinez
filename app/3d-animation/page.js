import PageLayout from "@/components/PageLayout";
import VideoGrid from "@/components/VideoGrid";
import { videosBySection } from "@/data/videos";

export const metadata = {
  title: "3D | Luca Martinez"
};

export default function ThreeDAnimationPage() {
  const items = videosBySection.threeDAnimation ?? [];
  const hasItems = items.some((item) => item.thumbnail !== "/images/placeholder-frame.svg");

  return (
    <PageLayout
      currentPath="/3d-animation"
      eyebrow="Motion"
      title="3D"
      description="Computer-generated and 3D-animated work."
    >
      {hasItems ? (
        <VideoGrid items={items} />
      ) : (
        <p className="text-sm uppercase tracking-editorial text-muted md:text-xs">
          Coming soon.
        </p>
      )}
    </PageLayout>
  );
}
