import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import PhotoGrid from "../components/PhotoGrid";
import Status from "../components/Status";
import ProfileCard from "../components/ProfileCard";
export default function Gallery({ mine = false, owner = null }) {
  const { user } = useAuth();
  const profile = mine ? user : owner;
  const ownerId = profile?._id;
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState("newest");
  const [view, setView] = useState("three");
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setPhotos([]);
    api(ownerId ? `/users/${ownerId}/photos` : "/photos")
      .then((data) => {
        if (active) setPhotos(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [ownerId]);
  const visible = photos;
  const sortedPhotos = order === "oldest" ? [...visible].reverse() : visible;
  return (
    <section className="gallery-page">
      {profile && (
        <ProfileCard
          user={profile}
          email={user?._id === profile._id ? user.email : ""}
        />
      )}
      <div className="page-intro intro-with-action">
        <div>
          {profile ? (
            <h2 className="my-photos-heading">{mine ? "My photos" : "Photos"}</h2>
          ) : (
            <>
              <h1>Our memories</h1>
              <p className="muted">Little moments, shared together.</p>
            </>
          )}
        </div>
        {user && (!profile || user._id === profile._id) && (
          <Link className="button button-dark" to="/upload">
            + Upload a photo
          </Link>
        )}
      </div>
      <div className="gallery-toolbar">
        <strong>
          {loading ? "Loading photos..." : `${visible.length} photos`}
        </strong>
        <label className="gallery-sort">
          Sort by
          <select
            className="view-button"
            value={order}
            onChange={(event) => setOrder(event.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
        <div className="view-switch" role="group" aria-label="Gallery display">
          {[
            ["three", "3 columns"],
            ["four", "4 columns"],
            ["list", "List"],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={view === value}
              className={`view-button ${view === value ? "active" : ""}`}
              onClick={() => setView(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <Status loading={loading} error={error}>
        <PhotoGrid photos={sortedPhotos} view={view} />
      </Status>
    </section>
  );
}
