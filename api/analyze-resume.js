export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body;

  try {
    body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { resumeText } = body || {};

  if (!resumeText || resumeText.trim().length < 100) {
    return res.status(400).json({
      error: "Resume text is required"
    });
  }

  // ✅ TEMP MVP RESPONSE — SAFE & STABLE
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
