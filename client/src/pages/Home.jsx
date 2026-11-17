import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import PhotoGrid from "../components/PhotoGrid";
import Status from "../components/Status";
export default function Home() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api("/photos")
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
  }, []);
  return (
    <>
      <section className="home-hero two-columns">
        <div>
          <h1>Share your memories.</h1>
          <p className="hero-copy">A simple place for photos and stories.</p>
          <div className="hero-actions">
            <Link className="button button-dark" to="/photos">
              Browse photos
            </Link>
            <Link
              className="button button-outline"
              to={user ? "/upload" : "/register"}
            >
              {user ? "Upload a photo" : "Sign up"}
            </Link>
          </div>
          {!loading && !error && (
            <p className="home-counts">{photos.length} shared memories</p>
          )}
        </div>
        <img
          className="hero-picture"
          src="/images/hero.svg"
          alt="Simple landscape illustration"
        />
      </section>
      <section className="home-section">
        <div className="section-heading">
          <h2>Recent photos</h2>
          <Link className="inline-link" to="/photos">
            View all ?
          </Link>
        </div>
        <Status loading={loading} error={error}>
          <PhotoGrid photos={photos.slice(0, 3)} />
        </Status>
      </section>
    </>
  );
}
