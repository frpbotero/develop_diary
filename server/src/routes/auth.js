import bcrypt from "bcryptjs";
import express from "express";
import { User } from "../models/User.js";
import { signToken } from "../utils/token.js";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nome, email e senha sao obrigatorios." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "A senha precisa ter pelo menos 6 caracteres." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email ja cadastrado." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha sao obrigatorios." });
    }

    const user = await User.findOne({ email });
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!valid) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    res.json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});
