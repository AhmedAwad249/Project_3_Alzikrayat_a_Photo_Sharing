import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, fullName } from "../api";
import Status from "../components/Status";

export default function People() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api("/users")
      .then((data) => {
        if (active) setUsers(data);
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
    <section className="gallery-page">
      <div className="page-intro">
        <h1>People</h1>
      </div>
      <Status loading={loading} error={error}>
        {users.length ? (
          <div className="people-grid">
            {users.map((user) => (
              <Link
                className="person-card"
                to={`/users/${user._id}`}
                key={user._id}
              >
                <span className="profile-avatar" aria-hidden="true">
                  {user.firstName?.[0] || "?"}
                </span>
                <span className="person-info">
                  <strong>{fullName(user)}</strong>
                  {(user.occupation || user.location) && (
                    <small>{user.occupation || user.location}</small>
                  )}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-panel">
            <h2>No members yet.</h2>
          </div>
        )}
      </Status>
    </section>
  );
}
