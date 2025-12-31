const router = require("express").Router();
const axios = require("axios");
const Job = require("../models/Job");
const User = require("../models/User");

router.post("/post", async (req, res) => {
  const job = await Job.create(req.body);
  res.json(job);
});

router.post("/apply", async (req, res) => {
  const user = await User.findById(req.body.userId);
  const job = await Job.findById(req.body.jobId);

  const response = await axios.post("http://127.0.0.1:8000/match", {
    resume_text: user.resumeText,
    job_text: job.description,
    resume_skills: user.skills,
    job_skills: job.skills
  });

  res.json(response.data);
});

module.exports = router;
