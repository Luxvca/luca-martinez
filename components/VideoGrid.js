import VideoCard from "@/components/VideoCard";

export default function VideoGrid({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <VideoCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
