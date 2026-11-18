import path from "node:path";
import { readFile, unlink } from "node:fs/promises";
import Photo from "../models/Photo.js";
import Comment from "../models/Comment.js";
import { uploadDirectory } from "../middleware/upload.js";

function likeStats(likedBy = [], userId) {
  return {
    likeCount: likedBy.length,
    liked: likedBy.some((id) => id.toString() === userId),
  };
}

export async function getAll(req, res) {
  const photos = await Photo.find(
    req.params.id ? { userId: req.params.id } : {}
  )
    .populate("userId", "firstName lastName")
    .select("+likedBy")
    .sort({ dateTime: -1, _id: -1 })
    .lean();
  const totals = await Comment.aggregate([
    { $match: { photoId: { $in: photos.map(({ _id }) => _id) } } },
    { $group: { _id: "$photoId", count: { $sum: 1 } } },
  ]);
  const commentCounts = new Map(
    totals.map(({ _id, count }) => [_id.toString(), count])
  );
  res.json(
    photos.map(({ likedBy, ...photo }) => ({
      ...photo,
      likeCount: likeStats(likedBy).likeCount,
      commentCount: commentCounts.get(photo._id.toString()) ?? 0,
    }))
  );
}

export async function getOne(req, res) {
  const result = await Photo.findById(req.params.id)
    .select("+likedBy")
    .populate("userId", "firstName lastName")
    .lean();
  if (!result) return res.status(404).json({ message: "Photo not found." });
  const { likedBy, ...photo } = result;
  const comments = await Comment.find({ photoId: photo._id })
    .populate("userId", "firstName lastName")
    .sort({ dateTime: 1, _id: 1 });
  res.json({
    photo: { ...photo, ...likeStats(likedBy, req.session.userId) },
    comments,
  });
}

export async function setLike(req, res) {
  const userId = req.session.userId;
  const update = req.method === "PUT"
    ? { $addToSet: { likedBy: userId } }
    : { $pull: { likedBy: userId } };
  const photo = await Photo.findByIdAndUpdate(req.params.id, update, { new: true })
    .select("+likedBy");
  if (!photo) return res.status(404).json({ message: "Photo not found." });
  res.json(likeStats(photo.likedBy, userId));
}
export async function create(req, res) {
  if (!req.file)
    return res.status(400).json({ message: "Please select an image." });
  // Check the image file type.
  const bytes = await readFile(req.file.path);
  const signatures = {
    "image/jpeg": bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
    "image/png": bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    "image/webp":
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP",
  };
  if (!signatures[req.file.mimetype])
    throw Object.assign(new Error("The file is not a valid image."), {
      status: 400,
    });
  const photo = await Photo.create({
    ...req.body,
    userId: req.session.userId,
    fileName: req.file.filename,
  });
  req.file = null;
  await photo.populate("userId", "firstName lastName");
  const { likedBy, ...created } = photo.toObject();
  res.status(201).location(`/api/photos/${photo._id}`).json(created);
}
export async function remove(req, res) {
  const photo = await Photo.findById(req.params.id);
  if (!photo) return res.status(404).json({ message: "Photo not found." });
  if (photo.userId.toString() !== req.session.userId)
    return res
      .status(403)
      .json({ message: "You can only delete your own photos." });
  await unlink(path.join(uploadDirectory, path.basename(photo.fileName))).catch(
    (error) => {
      if (error.code !== "ENOENT") throw error;
    }
  );
  await Comment.deleteMany({ photoId: photo._id });
  await photo.deleteOne();
  res.status(204).end();
}
