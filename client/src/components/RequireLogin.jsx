import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Status from "./Status";
export default function RequireLogin({ children }) {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  return (
    <Status loading={loading} error={error}>
      {user ? (
        children
      ) : (
        <Navigate to="/login" state={{ from: location.pathname }} replace />
      )}
    </Status>
  );
}
