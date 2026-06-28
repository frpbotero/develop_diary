import express from "express";
import { defaultGoal } from "../data/defaultGoal.js";
import { Goal } from "../models/Goal.js";

export const goalsRouter = express.Router();

goalsRouter.get("/", async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    next(error);
  }
});

goalsRouter.post("/", async (req, res, next) => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.user.id });
    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
});

goalsRouter.post("/seed-default", async (req, res, next) => {
  try {
    const goal = await Goal.create({ ...defaultGoal, user: req.user.id });
    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
});

goalsRouter.patch("/:id", async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) return res.status(404).json({ message: "Objetivo nao encontrado." });
    res.json(goal);
  } catch (error) {
    next(error);
  }
});

goalsRouter.delete("/:id", async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ message: "Objetivo nao encontrado." });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
