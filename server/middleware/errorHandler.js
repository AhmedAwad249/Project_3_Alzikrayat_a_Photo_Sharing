import { unlink } from "node:fs/promises";

export default async function errorHandler(error, req, res, next) {
  if (req.file) await unlink(req.file.path).catch(() => {});
  if (error.code === 11000)
    return res
      .status(409)
      .json({ message: "This email is already registered." });
  if (error.name === "MulterError")
    return res
      .status(400)
      .json({
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "Image must be 5 MB or smaller."
            : "Upload one image using the image field.",
      });
  const status =
    error.status ||
    (["ValidationError", "CastError"].includes(error.name) ? 400 : 500);
  if (status === 500) console.error(error);
  res
    .status(status)
    .json({
      message:
        status === 500
          ? "Something went wrong. Please try again."
          : error.message,
    });
}

// Send async errors to the error handler.
export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
