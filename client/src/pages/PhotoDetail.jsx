import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, fullName, dateLabel } from "../api";
import { useAuth } from "../context/AuthContext";
import Status from "../components/Status";
import CommentForm from "../components/CommentForm";
export default function PhotoDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [liking, setLiking] = useState(false);
  const [likeError, setLikeError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setLikeError("");
    api(`/photos/${id}`)
      .then((data) => {
        if (active) {
          setPhoto(data.photo);
          setComments(data.comments);
        }
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
  }, [id]);
  async function changeLike() {
    setLiking(true);
    setLikeError("");
    try {
      const stats = await api(`/photos/${id}/like`, {
        method: photo.liked ? "DELETE" : "PUT",
      });
      setPhoto((current) =>
        current?._id === id ? { ...current, ...stats } : current
      );
    } catch (err) {
      setLikeError(err.message);
    } finally {
      setLiking(false);
    }
  }
  async function remove() {
    if (!window.confirm("Delete this photo and its comments?")) return;
    setBusy(true);
    setDeleteError("");
    try {
      await api(`/photos/${id}`, { method: "DELETE" });
      navigate("/photos");
    } catch (err) {
      setDeleteError(err.message);
      setBusy(false);
    }
  }
  return (
    <section className="detail-page">
      <Link className="back-link" to="/photos">
        ? Back to gallery
      </Link>
      <Status loading={loading} error={error}>
        {photo && (
          <>
            <div className="detail-layout">
              <div className="detail-image">
                <img src={`/uploads/${photo.fileName}`} alt={photo.title} />
              </div>
              <div className="detail-copy">
                <h1>{photo.title}</h1>
                <div className="detail-byline">
                  <span className="avatar" aria-hidden="true">
                    {photo.userId?.firstName?.[0] || "?"}
                  </span>
                  <div>
                    <strong>{fullName(photo.userId)}</strong>
                    <time dateTime={photo.dateTime}>
                      {dateLabel(photo.dateTime)}
                    </time>
                  </div>
                </div>
                <p className="detail-story">
                  {photo.description || "A moment worth remembering."}
                </p>
                <p className="muted" aria-live="polite">
                  {photo.likeCount ?? 0} likes &middot; {comments.length} comments
                </p>
                {user ? (
                  <button
                    className={`button ${photo.liked ? "button-dark" : "button-outline"}`}
                    aria-pressed={Boolean(photo.liked)}
                    disabled={liking}
                    onClick={changeLike}
                  >
                    {photo.liked ? "Unlike" : "Like"}
                  </button>
                ) : (
                  <Link
                    className="button button-outline"
                    to="/login"
                    state={{ from: `/photos/${id}` }}
                  >
                    Log in to like
                  </Link>
                )}
                {likeError && <p className="form-alert" role="alert">{likeError}</p>}
                {user?._id === photo.userId?._id && (
                  <button
                    className="button button-outline danger-action"
                    disabled={busy}
                    onClick={remove}
                  >
                    {busy ? "Deleting..." : "Delete photo"}
                  </button>
                )}
                {deleteError && (
                  <p className="form-alert" role="alert">
                    {deleteError}
                  </p>
                )}
              </div>
            </div>
            <section className="comments-section">
              <h2>
                Comments{" "}
                <span className="comment-total">({comments.length})</span>
              </h2>
              {user ? (
                <CommentForm
                  key={id}
                  photoId={id}
                  onAdd={(created) =>
                    setComments((previous) => [...previous, created])
                  }
                />
              ) : (
                <p className="login-to-comment">
                  <Link to="/login" state={{ from: `/photos/${id}` }}>
                    Log in
                  </Link>{" "}
                  to leave a comment.
                </p>
              )}
              <div className="comment-list" aria-live="polite">
                {comments.length ? (
                  comments.map((item) => (
                    <article className="comment" key={item._id}>
                      <span className="avatar" aria-hidden="true">
                        {item.userId?.firstName?.[0] || "?"}
                      </span>
                      <div>
                        <div className="comment-meta">
                          <strong>{fullName(item.userId)}</strong>
                          <time dateTime={item.dateTime}>
                            {dateLabel(item.dateTime)}
                          </time>
                        </div>
                        <p>{item.comment}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="no-comments">
                    No comments yet. Start the conversation.
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </Status>
    </section>
  );
}
