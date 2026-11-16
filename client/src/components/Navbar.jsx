import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <header className="site-header">
      <nav className="nav-bar page-width" aria-label="Main navigation">
        <Link className="brand" to="/">
          Alzikrayat<span className="brand-dot">.</span>
        </Link>
        <div className="nav-links">
          <NavLink className="nav-link" end to="/">
            Home
          </NavLink>
          <NavLink className="nav-link" to="/photos">
            Gallery
          </NavLink>
          <NavLink className="nav-link" to="/about">
            About
          </NavLink>
        </div>
        <div className="nav-actions">
          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <>
              <Link className="text-link account-link" to="/my-photos">
                Hi, {user.firstName}
              </Link>
              <Link className="button button-dark nav-upload" to="/upload">
                Upload
              </Link>
              <button className="button button-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="text-link" to="/login">
                Please Login
              </Link>
              <Link className="button button-dark" to="/register">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
      {error && (
        <p className="form-alert page-width" role="alert">
          {error}
        </p>
      )}
    </header>
  );
}
