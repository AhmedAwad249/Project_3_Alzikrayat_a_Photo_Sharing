import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import Gallery from "./Gallery";
import Status from "../components/Status";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setProfile(null);
    api(`/users/${id}`)
      .then((data) => {
        if (active) setProfile(data);
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
  return (
    <>
      <Link className="back-link profile-back-link" to="/users">
        <span aria-hidden="true">&larr;</span> Back to people
      </Link>
      <Status loading={loading} error={error}>
        {profile && <Gallery key={profile._id} owner={profile} />}
      </Status>
    </>
  );
}
