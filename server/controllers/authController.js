import bcrypt from "bcryptjs";
import User from "../models/User.js";

export function publicUser(user) {
  const { password, ...profile } = user.toObject();
  return profile;
}
function beginSession(req, user) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) return reject(error);
      req.session.userId = user._id.toString();
      req.session.save((error) => (error ? reject(error) : resolve()));
    });
  });
}
export async function register(req, res) {
  const password = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({ ...req.body, password });
  await beginSession(req, user);
  res.status(201).json({ user: publicUser(user) });
}
export async function login(req, res) {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ message: "Incorrect email or password." });
  await beginSession(req, user);
  res.json({ user: publicUser(user) });
}
export async function me(req, res) {
  const user = req.session.userId
    ? await User.findById(req.session.userId)
    : null;
  res.json({ user });
}
export function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("alzikrayat.sid");
    res.status(204).end();
  });
}
