import Joi from "joi";
import mongoose from "mongoose";

export const registerSchema = Joi.object({
  firstName: Joi.string().trim().max(50).required(),
  lastName: Joi.string().trim().max(50).required(),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .max(254)
    .required(),
  password: Joi.string()
    .min(8)
    .max(72)
    .custom((value, helpers) =>
      Buffer.byteLength(value) > 72
        ? helpers.error("string.max", { limit: 72 })
        : value
    )
    .required(),
  location: Joi.string().trim().max(100).allow(""),
  occupation: Joi.string().trim().max(100).allow(""),
  description: Joi.string().trim().max(1000).allow(""),
});
export const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().max(200).required(),
});
export const photoSchema = Joi.object({
  title: Joi.string().trim().max(100).required(),
  description: Joi.string().trim().max(2000).allow(""),
});
export const commentSchema = Joi.object({
  comment: Joi.string().trim().max(1000).required(),
});

export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error)
      return next(
        Object.assign(
          new Error(error.details.map((item) => item.message).join(" ")),
          { status: 400 }
        )
      );
    req.body = value;
    next();
  };
}
export function validId(req, res, next) {
  if (!mongoose.isObjectIdOrHexString(req.params.id))
    return res.status(400).json({ message: "Invalid ID." });
  next();
}
