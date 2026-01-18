export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resumeText } = req.body || {};

  // MVP: allow short resumes, just require something
  if (!resumeText || resumeText.trim().length < 20) {
    return res.status(400).json({
      error: "Please paste more of your resume to continue."
    });
  }

  return res.status(200).json({
    upgradeRequired: false,
    strengths: [
      "Your resume is clearly structured and easy to scan.",
      "Your experience sections are well separated."
    ],
    risks: [
      "Some bullets could be more results-focused.",
      "Your summary could be more targeted."
    ],
    next_steps: [
      "Clarify the roles you are targeting.",
      "Add measurable outcomes where possible."
    ]
  });
}
