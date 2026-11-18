import { Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireLogin from "./components/RequireLogin";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import LoginRegister from "./pages/LoginRegister";
import Upload from "./pages/Upload";
import PhotoDetail from "./pages/PhotoDetail";
import About from "./pages/About";
import People from "./pages/People";
import Profile from "./pages/Profile";
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="site-shell">
        <Navbar />
        <main id="main-content" className="page-width">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/photos" element={<Gallery />} />
            <Route path="/photos/:id" element={<PhotoDetail />} />
            <Route path="/users" element={<People />} />
            <Route path="/users/:id" element={<Profile />} />
            <Route
              path="/my-photos"
              element={
                <RequireLogin>
                  <Gallery mine />
                </RequireLogin>
              }
            />
            <Route
              path="/upload"
              element={
                <RequireLogin>
                  <Upload />
                </RequireLogin>
              }
            />
            <Route path="/login" element={<LoginRegister key="login" />} />
            <Route
              path="/register"
              element={<LoginRegister key="register" register />}
            />
            <Route path="/about" element={<About />} />
            <Route
              path="*"
              element={
                <section className="about-page">
                  <h1>Page not found</h1>
                  <Link className="button button-dark" to="/">
                    Back home
                  </Link>
                </section>
              }
            />
          </Routes>
        </main>
      </div>
    </>
  );
}
