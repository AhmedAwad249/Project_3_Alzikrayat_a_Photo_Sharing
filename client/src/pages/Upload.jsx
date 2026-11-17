import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function selectFile(event) {
    const selected = event.target.files[0];
    setError("");
    if (
      selected &&
      (!["image/jpeg", "image/png", "image/webp"].includes(selected.type) ||
        selected.size > 5 * 1024 * 1024)
    ) {
      setError("Choose a JPG, PNG or WebP image, up to 5 MB.");
      setFile(null);
      event.target.value = "";
      return;
    }
    setFile(selected || null);
  }
  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!file) {
      setError("Please select an image.");
      return;
    }
    const data = new FormData(event.currentTarget);
    data.set("image", file);
    setBusy(true);
    try {
      const photo = await api("/photos", { method: "POST", body: data });
      navigate(`/photos/${photo._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="upload-page">
      <div className="page-intro">
        <h1>Share a memory</h1>
        <p className="muted">Choose a photo and tell its story.</p>
      </div>
      {error && (
        <p className="form-alert" role="alert">
          {error}
        </p>
      )}
      <form className="upload-layout" onSubmit={submit}>
        <div className="form-card upload-image-card">
          <label className="drop-zone" htmlFor="image">
            {preview ? (
              <img
                className="upload-preview"
                src={preview}
                alt="Selected photo preview"
              />
            ) : (
              <>
                <span className="upload-symbol" aria-hidden="true">
                  ?
                </span>
                <strong>Choose your photo</strong>
                <span>JPG, PNG or WebP ? up to 5 MB</span>
              </>
            )}
          </label>
          <input
            className="file-input"
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={selectFile}
            required
          />
        </div>
        <div className="form-card upload-fields">
          <div className="field">
            <label htmlFor="title">Photo title</label>
            <input
              id="title"
              name="title"
              maxLength={100}
              placeholder="Give your memory a name"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="description">
              The story <span className="optional-label">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              maxLength={2000}
              placeholder="What would you like to remember?"
            />
          </div>
          <div className="upload-actions">
            <Link className="button button-outline" to="/photos">
              Cancel
            </Link>
            <button className="button button-dark" disabled={busy}>
              {busy ? "Uploading..." : "Share photo"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
