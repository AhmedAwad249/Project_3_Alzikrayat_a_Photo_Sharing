import express from "express";
import cors from "cors";
import session from "express-session";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/authRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { checkOrigin } from "./middleware/auth.js";
import { uploadDirectory } from "./middleware/upload.js";

export function createApp() {
  if (!process.env.SESSION_SECRET)
    throw new Error("Set SESSION_SECRET in server/.env before starting.");
  const app = express();
  app.disable("x-powered-by");
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(checkOrigin);
  app.use(express.json({ limit: "20kb" }));
  app.use(
    session({
      name: "alzikrayat.sid",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 86400000,
        secure: process.env.COOKIE_SECURE === "true",
      },
    })
  );
  app.use(
    "/uploads",
    express.static(uploadDirectory, {
      dotfiles: "deny",
      setHeaders: (res) => res.set("X-Content-Type-Options", "nosniff"),
    })
  );
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", authRoutes);
  app.use("/api/photos", photoRoutes);
  app.use("/api", (req, res) =>
    res.status(404).json({ message: "API route not found." })
  );
  const clientDirectory = fileURLToPath(
    new URL("../client/dist/", import.meta.url)
  );
  if (existsSync(clientDirectory)) {
    app.use(express.static(clientDirectory));
    app.get("*", (req, res) =>
      res.sendFile(path.join(clientDirectory, "index.html"))
    );
  }
  app.use((req, res) => res.status(404).json({ message: "Not found." }));
  app.use(errorHandler);
  return app;
}
