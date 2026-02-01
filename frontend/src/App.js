import React, { useMemo, useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function parseSkills(text) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [resumeSkillsText, setResumeSkillsText] = useState("");
  const [jobSkillsText, setJobSkillsText] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const resumeSkills = useMemo(() => parseSkills(resumeSkillsText), [resumeSkillsText]);
  const jobSkills = useMemo(() => parseSkills(jobSkillsText), [jobSkillsText]);

  async function onMatch() {
    setError("");
    setResult(null);

    if (!resumeText.trim() || !jobText.trim()) {
      setError("Please paste both resume text and job description.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/api/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resumeText,
          job_text: jobText,
          resume_skills: resumeSkills,
          job_skills: jobSkills
        })
      });

      const data = await resp.json();
      if (!resp.ok) {
        setError(data?.error || "Request failed");
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 4 }}>VeriHire</h1>
      <p style={{ marginTop: 0, color: "#444" }}>
        Resume–Job match score using semantic similarity + missing skills.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        <label>
          <b>Resume Text</b>
          <textarea
            rows={8}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste resume text here..."
            style={{ width: "100%", marginTop: 6 }}
          />
        </label>

        <label>
          <b>Job Description</b>
          <textarea
            rows={8}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste job description here..."
            style={{ width: "100%", marginTop: 6 }}
          />
        </label>

        <label>
          <b>Resume Skills</b> (comma-separated)
          <input
            value={resumeSkillsText}
            onChange={(e) => setResumeSkillsText(e.target.value)}
            placeholder="e.g., python, sql, mongodb, react"
            style={{ width: "100%", marginTop: 6, padding: 8 }}
          />
        </label>

        <label>
          <b>Job Skills</b> (comma-separated)
          <input
            value={jobSkillsText}
            onChange={(e) => setJobSkillsText(e.target.value)}
            placeholder="e.g., python, sql, docker, aws"
            style={{ width: "100%", marginTop: 6, padding: 8 }}
          />
        </label>

        <button onClick={onMatch} disabled={loading} style={{ padding: "10px 14px", cursor: "pointer" }}>
          {loading ? "Matching..." : "Match"}
        </button>

        {error && <div style={{ color: "crimson" }}><b>Error:</b> {error}</div>}

        {result && (
          <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Result</h3>
            <p><b>Match Score:</b> {result.match_score}%</p>
            <p><b>Missing Skills:</b> {result.missing_skills?.length ? result.missing_skills.join(", ") : "None"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
