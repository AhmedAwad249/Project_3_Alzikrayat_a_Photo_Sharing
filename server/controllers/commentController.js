import Comment from "../models/Comment.js";
import Photo from "../models/Photo.js";

export async function create(req, res) {
  if (!(await Photo.exists({ _id: req.params.id })))
    return res.status(404).json({ message: "Photo not found." });
  const comment = await Comment.create({
    photoId: req.params.id,
    userId: req.session.userId,
    comment: req.body.comment,
  });
  await comment.populate("userId", "firstName lastName");
  res.status(201).json(comment);
}
