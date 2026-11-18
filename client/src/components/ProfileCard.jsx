import { fullName } from "../api";

export default function ProfileCard({ user, email }) {
  return (
    <div className="profile-card">
      <span className="profile-avatar" aria-hidden="true">
        {user.firstName?.[0] || "?"}
      </span>
      <div className="profile-details">
        <h1>{fullName(user)}</h1>
        {email && <p className="profile-email">{email}</p>}
        {(user.location || user.occupation) && (
          <div className="profile-meta">
            {user.location && <span>Location: {user.location}</span>}
            {user.occupation && <span>Occupation: {user.occupation}</span>}
          </div>
        )}
        {user.description && (
          <p className="profile-description">{user.description}</p>
        )}
      </div>
    </div>
  );
}
