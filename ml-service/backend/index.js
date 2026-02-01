const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const ML_BASE_URL = process.env.ML_BASE_URL || "http://127.0.0.1:8000";

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "backend" });
});

// Proxy endpoint: frontend hits backend; backend calls ML service
app.post("/api/match", async (req, res) => {
  try {
    const payload = req.body;

    // Basic validation
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    const rtext = (payload.resume_text || "").trim();
    const jtext = (payload.job_text || "").trim();

    if (!rtext || !jtext) {
      return res.status(400).json({ error: "resume_text and job_text are required" });
    }

    const response = await fetch(`${ML_BASE_URL}/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: "ML service error", details: data });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Proxying ML at: ${ML_BASE_URL}`);
});
