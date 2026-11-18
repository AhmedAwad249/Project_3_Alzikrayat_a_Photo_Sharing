import User from "../models/User.js";

export async function getAll(req, res) {
  const users = await User.find()
    .select("firstName lastName location occupation")
    .sort({ firstName: 1, lastName: 1, _id: 1 });
  res.json(users);
}

export async function getOne(req, res) {
  const user = await User.findById(req.params.id).select(
    "firstName lastName location occupation description"
  );
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json(user);
}
