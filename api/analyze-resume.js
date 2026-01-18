export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resumeText } = req.body || {};

  if (!resumeText || resumeText.trim().length < 100) {
    return res.status(400).json({
      error: "Resume text is required"
    });
  }

  // TEMP MVP RESPONSE (safe + predictable)
  return res.status(200).json({
    upgradeRequired: false,
    strengths: [
      "Your resume is clearly structured and easy to scan.",
      "Professional experience is separated cleanly by role."
    ],
    risks: [
      "Some bullet points could be more results-focused.",
      "Your summary could better reflect your target role."
    ],
    next_steps: [
      "Clarify the roles you are targeting.",
      "Add measurable outcomes where possible."
    ]
  });
}
