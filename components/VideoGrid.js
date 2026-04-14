import VideoCard from "@/components/VideoCard";

export default function VideoGrid({ items }) {
  const visibleItems = items.filter((item) => item.thumbnail !== "/images/placeholder-frame.svg");

  return (
    <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-3">
      {visibleItems.map((item) => (
        <VideoCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
