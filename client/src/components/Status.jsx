export default function Status({ loading, error, children }) {
  if (loading)
    return (
      <p className="notice" role="status">
        Loading...
      </p>
    );
  if (error)
    return (
      <p className="form-alert" role="alert">
        {error}
      </p>
    );
  return children;
}
