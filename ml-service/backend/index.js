const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Match = require("./models/Match");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT || 5000;
const ML_BASE_URL = process.env.ML_BASE_URL || "http://127.0.0.1:8000";
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/verihire";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.post("/api/match", async (req, res) => {
  try {
    const payload = req.body;

    const response = await fetch(`${ML_BASE_URL}/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: "ML service failed" });
    }

    // Save to MongoDB
    const record = await Match.create({
      resumeText: payload.resume_text,
      jobText: payload.job_text,
      resumeSkills: payload.resume_skills || [],
      jobSkills: payload.job_skills || [],
      matchScore: data.match_score,
      missingSkills: data.missing_skills
    });

    res.json({ ...data, id: record._id });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/history", async (_, res) => {
  const history = await Match.find().sort({ createdAt: -1 }).limit(20);
  res.json(history);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
