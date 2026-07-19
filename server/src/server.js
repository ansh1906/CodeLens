import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyzeRouter } from "./routes/analyze.js";
import { connectDB } from "../config/db.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api", analyzeRouter);

const port = process.env.PORT || 8787;
await connectDB();

app.listen(port, () => {
  console.log(`CodeLens API listening on http://localhost:${port}`);
});
