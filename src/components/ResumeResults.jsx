import React from "react";

const Section = ({ title, children }) => (
  <div className="rounded-lg border p-4 space-y-2">
    <h3 className="font-semibold">{title}</h3>
    {children}
  </div>
);

const ResumeResults = ({ results }) => {
  if (!results) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        Paste your resume above and click “Analyze Resume” to get feedback.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.interview_readiness && (
        <div className="rounded-lg border-l-4 border-black bg-muted p-4">
          <p className="font-semibold">
            Interview Readiness: {results.interview_readiness}
          </p>
          <p className="text-sm text-muted-foreground">
            Resume is close to interview-ready with a few focused improvements.
          </p>
        </div>
      )}

      <Section title="Overall Impression">
        <p>{results.summary}</p>
      </Section>

      {results.strengths?.length > 0 && (
        <Section title="Strengths">
          <ul className="list-disc pl-5">
            {results.strengths.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {results.gaps?.length > 0 && (
        <Section title="Fix This First">
          <ul className="list-disc pl-5">
            {results.gaps.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {results.recommendations?.length > 0 && (
        <Section title="Recommendations">
          <ul className="list-disc pl-5">
            {results.recommendations.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {results.ats_tips?.length > 0 && (
        <Section title="ATS Tips">
          <ul className="list-disc pl-5">
            {results.ats_tips.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
};

export default ResumeResults;



