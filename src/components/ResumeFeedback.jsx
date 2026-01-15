const ResumeFeedback = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="mt-6 rounded-lg border bg-white p-6 space-y-4">
      <h2 className="text-xl font-semibold">Feedback</h2>

      <div>
        <strong>Interview readiness:</strong>{" "}
        {feedback.interview_readiness}
      </div>

      <div>
        <strong>Fix first:</strong>{" "}
        {feedback.fix_first}
      </div>

      <div>
        <strong>Overall impression:</strong>{" "}
        {feedback.overall_impression}
      </div>

      {Array.isArray(feedback.strengths) && (
        <div>
          <strong>Strengths:</strong>
          <ul className="list-disc pl-6 mt-1">
            {feedback.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(feedback.gaps) && (
        <div>
          <strong>Gaps:</strong>
          <ul className="list-disc pl-6 mt-1">
            {feedback.gaps.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(feedback.ats_tips) && (
        <div>
          <strong>ATS tips:</strong>
          <ul className="list-disc pl-6 mt-1">
            {feedback.ats_tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeFeedback;
