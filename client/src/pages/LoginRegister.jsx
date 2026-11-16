import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function LoginRegister({ register = false }) {
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (register && values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    delete values.confirmPassword;
    setBusy(true);
    try {
      await authenticate(register ? "register" : "login", values);
      navigate(location.state?.from || "/photos", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-page">
      <div className="auth-intro">
        <h1>{register ? "Create your account" : "Welcome back"}</h1>
        <p className="muted">
          {register
            ? "Start sharing your memories."
            : "Log in to share a photo or leave a comment."}
        </p>
      </div>
      <form className="form-card" onSubmit={submit}>
        {error && (
          <p className="form-alert" role="alert">
            {error}
          </p>
        )}
        <div className="form-grid">
          {register && (
            <>
              <Field
                name="firstName"
                label="First name"
                maxLength={50}
                autoComplete="given-name"
                required
              />
              <Field
                name="lastName"
                label="Last name"
                maxLength={50}
                autoComplete="family-name"
                required
              />
            </>
          )}
          <Field
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            wide
          />
          <Field
            name="password"
            label="Password"
            type="password"
            minLength={register ? 8 : undefined}
            maxLength={72}
            autoComplete={register ? "new-password" : "current-password"}
            required
            wide={!register}
          />
          {register && (
            <Field
              name="confirmPassword"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
            />
          )}
        </div>
        {register && (
          <>
            <div className="optional-heading">
              <h2>
                About you <span>(optional)</span>
              </h2>
            </div>
            <div className="form-grid">
              <Field name="location" label="Location" maxLength={100} />
              <Field name="occupation" label="Occupation" maxLength={100} />
              <div className="field full-width">
                <label htmlFor="description">A little about you</label>
                <textarea
                  id="description"
                  name="description"
                  maxLength={1000}
                />
              </div>
            </div>
            <small className="muted">
              Use at least 8 characters for your password.
            </small>
          </>
        )}
        <button className="button button-dark form-submit" disabled={busy}>
          {busy ? "Please wait..." : register ? "Create account" : "Log in"}
        </button>
        <p className="form-switch">
          {register ? "Already a member?" : "New here?"}{" "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Log in" : "Create an account"}
          </Link>
        </p>
      </form>
    </section>
  );
}
function Field({ name, label, wide, ...props }) {
  return (
    <div className={`field ${wide ? "full-width" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...props} />
    </div>
  );
}
