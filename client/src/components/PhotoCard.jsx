import { Link } from "react-router-dom";
import { fullName, dateLabel } from "../api";
export default function PhotoCard({ photo }) {
  const link = `/photos/${photo._id}`;
  return (
    <article className="photo-card">
      <Link className="photo-image" to={link}>
        <img
          src={`/uploads/${photo.fileName}`}
          alt={photo.title}
          loading="lazy"
        />
      </Link>
      <div className="photo-info">
        <div className="photo-main">
          <h3>
            <Link to={link}>{photo.title}</Link>
          </h3>
          <p>
            By {fullName(photo.userId)} ? {dateLabel(photo.dateTime)}
          </p>
        </div>
        <div className="photo-counts">
          <span>{photo.likeCount ?? 0} likes</span>
          <span>{photo.commentCount ?? 0} comments</span>
        </div>
      </div>
    </article>
  );
}
