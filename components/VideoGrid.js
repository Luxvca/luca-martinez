import VideoCard from "@/components/VideoCard";

const lgCols = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3" };

export default function VideoGrid({ items, cols = 3 }) {
  const visibleItems = items.filter((item) => item.thumbnail !== "/images/placeholder-frame.svg");

  return (
    <div className={`grid grid-cols-2 gap-1.5 sm:gap-2 ${lgCols[cols] ?? "lg:grid-cols-3"}`}>
      {visibleItems.map((item) => (
        <VideoCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
