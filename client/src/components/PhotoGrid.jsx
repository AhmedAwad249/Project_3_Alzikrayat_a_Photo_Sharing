import PhotoCard from "./PhotoCard";
export default function PhotoGrid({ photos, view = "three" }) {
  if (!photos.length)
    return (
      <div className="empty-panel">
        <h2>No photos yet.</h2>
        <p>Share a memory to get started.</p>
      </div>
    );
  return (
    <div className={`gallery-grid gallery-${view}`}>
      {photos.map((photo) => (
        <PhotoCard key={photo._id} photo={photo} />
      ))}
    </div>
  );
}
