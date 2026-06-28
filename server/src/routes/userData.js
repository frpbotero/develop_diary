import express from "express";
import { UserData } from "../models/UserData.js";

export const userDataRouter = express.Router();

userDataRouter.get("/", async (req, res, next) => {
  try {
    const prefix = req.query.prefix || "";
    const docs = await UserData.find({
      user: req.user.id,
      key: { $regex: `^${escapeRegex(prefix)}` },
    }).sort({ key: 1 });

    res.json(docs.map((doc) => ({ key: doc.key, value: doc.value })));
  } catch (error) {
    next(error);
  }
});

userDataRouter.get("/:key", async (req, res, next) => {
  try {
    const doc = await UserData.findOne({ user: req.user.id, key: req.params.key });
    if (!doc) return res.status(404).json(null);
    res.json({ key: doc.key, value: doc.value });
  } catch (error) {
    next(error);
  }
});

userDataRouter.put("/:key", async (req, res, next) => {
  try {
    const doc = await UserData.findOneAndUpdate(
      { user: req.user.id, key: req.params.key },
      { value: String(req.body.value ?? "") },
      { upsert: true, new: true }
    );
    res.json({ key: doc.key, value: doc.value });
  } catch (error) {
    next(error);
  }
});

userDataRouter.delete("/:key", async (req, res, next) => {
  try {
    await UserData.deleteOne({ user: req.user.id, key: req.params.key });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
