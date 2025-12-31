import axios from "axios";
import { useState } from "react";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const applyJob = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/job/apply", {
        userId: "PASTE_USER_ID",
        jobId: "PASTE_JOB_ID"
      });
      setResult(res.data);
    } catch (err) {
      alert("Backend or ML error");
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>VeriHire</h1>

      <button onClick={applyJob} disabled={loading}>
        {loading ? "Applying..." : "Apply for Job"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Match Score: {result.match_score}%</h3>
          <p>Missing Skills: {result.missing_skills.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default App;
