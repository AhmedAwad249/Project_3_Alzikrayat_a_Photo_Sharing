import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const uploadDirectory = fileURLToPath(
  new URL("../uploads/", import.meta.url)
);
mkdirSync(uploadDirectory, { recursive: true });
const extensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};
export const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, done) =>
      done(null, randomUUID() + extensions[file.mimetype]),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, done) => {
    const accepted =
      extensions[file.mimetype] &&
      [".jpg", ".jpeg", ".png", ".webp"].includes(
        path.extname(file.originalname).toLowerCase()
      );
    done(
      accepted
        ? null
        : Object.assign(new Error("Choose a JPG, PNG or WebP image."), {
            status: 400,
          }),
      !!accepted
    );
  },
});
