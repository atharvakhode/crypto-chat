import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import coinsRouter from "./routes/coins.js";
import qaRouter from "./routes/qa.js";
import { scheduleSync } from "./sync.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ msg: "Welcome to Crypto Dashboard API" }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/coins", coinsRouter);
app.use("/api/qa", qaRouter);

// kick off scheduled sync (and an immediate warm-up)
scheduleSync();

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
