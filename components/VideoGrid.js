import VideoCard from "@/components/VideoCard";

export default function VideoGrid({ items }) {
  const visibleItems = items.filter((item) => item.thumbnail !== "/images/placeholder-frame.svg");

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {visibleItems.map((item) => (
        <VideoCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
