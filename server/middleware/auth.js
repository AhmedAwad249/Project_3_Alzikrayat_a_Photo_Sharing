export function requireLogin(req, res, next) {
  if (!req.session.userId)
    return res.status(401).json({ message: "Please log in first." });
  next();
}

// Check where the request came from.
export function checkOrigin(req, res, next) {
  const origin = req.get("origin");
  const allowed = [
    process.env.CLIENT_ORIGIN || "http://localhost:5173",
    `${req.protocol}://${req.get("host")}`,
  ];
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    origin &&
    !allowed.includes(origin)
  ) {
    return res.status(403).json({ message: "Origin is not allowed." });
  }
  next();
}
