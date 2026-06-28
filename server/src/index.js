import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDb, isDbReady } from "./config/db.js";
import { requireAuth } from "./middleware/auth.js";
import { authRouter } from "./routes/auth.js";
import { goalsRouter } from "./routes/goals.js";
import { userDataRouter } from "./routes/userData.js";

const app = express();
const port = process.env.PORT || 4000;
const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((value) => value.trim());

app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, database: isDbReady() ? "connected" : "unavailable" });
});

app.use("/api", requireDb);
app.use("/api/auth", authRouter);
app.use("/api/goals", requireAuth, goalsRouter);
app.use("/api/storage", requireAuth, userDataRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  if (
    error?.name === "MongooseServerSelectionError" ||
    error?.name === "MongoServerSelectionError" ||
    error?.name === "MongoNetworkError" ||
    error?.message?.includes("ReplicaSetNoPrimary")
  ) {
    return sendDbUnavailable(res);
  }

  if (error?.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  res.status(500).json({ message: "Erro interno do servidor." });
});

function requireDb(_req, res, next) {
  if (!isDbReady()) return sendDbUnavailable(res);
  next();
}

function sendDbUnavailable(res) {
  return res.status(503).json({
    message:
      "MongoDB indisponivel. No Atlas, verifique Network Access/IP allowlist, usuario/senha e tente novamente.",
  });
}

async function connectWithRetry() {
  try {
    await connectDb();
  } catch (error) {
    console.error("Falha ao conectar no MongoDB", error.message);
    setTimeout(connectWithRetry, 10000);
  }
}

app.listen(port, () => console.log(`API rodando na porta ${port}`));
connectWithRetry();
