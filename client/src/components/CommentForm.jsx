import { useState } from "react";
import { api } from "../api";
export default function CommentForm({ photoId, onAdd }) {
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!comment.trim()) {
      setError("Write a comment first.");
      return;
    }
    setBusy(true);
    try {
      const created = await api(`/photos/${photoId}/comments`, {
        method: "POST",
        body: JSON.stringify({ comment }),
      });
      onAdd(created);
      setComment("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="form-card comment-form" onSubmit={submit}>
      <label htmlFor="comment">Leave a comment</label>
      <textarea
        id="comment"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        maxLength={1000}
        placeholder="Say something about this memory..."
        required
      />
      {error && (
        <p className="form-alert" role="alert">
          {error}
        </p>
      )}
      <div className="comment-submit">
        <button className="button button-dark" disabled={busy}>
          {busy ? "Posting..." : "Post comment"}
        </button>
      </div>
    </form>
  );
}
