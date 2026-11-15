import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";

dotenv.config({ path: fileURLToPath(new URL(".env", import.meta.url)) });
try {
  if (!process.env.MONGODB_URI)
    throw new Error("Set MONGODB_URI in server/.env.");
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  const app = createApp();
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Alzikrayat API: http://localhost:${process.env.PORT || 5000}`)
  );
} catch (error) {
  console.error("Could not start Alzikrayat:", error.message);
  process.exit(1);
}
