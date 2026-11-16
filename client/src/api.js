export async function api(url, options = {}) {
  const headers =
    options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" };
  let response;
  try {
    response = await fetch(`/api${url}`, {
      credentials: "include",
      ...options,
      headers: { ...headers, ...options.headers },
    });
  } catch {
    throw new Error(
      "Cannot connect to the server. Please check that the backend is running."
    );
  }
  if (response.status === 204) return null;
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The API is not available. Please check that the backend is running."
    );
  }
  if (!response.ok)
    throw new Error(data.message || "Request failed. Please try again.");
  return data;
}
export const fullName = (user) =>
  user ? `${user.firstName} ${user.lastName}` : "Former member";
export const dateLabel = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
