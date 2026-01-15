import React from "react";

export default function ResumeReviewFormatted({ results }) {
  if (!results) {
    return (
      <p className="text-gray-500 italic">
        No review data available.
      </p>
    );
  }

  const {
    overall_impression,
    interview_readiness,
    fix_first,
    strengths = [],
    gaps = [],
    ats_tips = [],
  } = results;

  return (
    <div className="space-y-6 text-gray-800">
      {overall_impression && (
        <section>
          <h3 className="font-semibold text-lg mb-1">
            Overall Impression
          </h3>
          <p>{overall_impression}</p>
        </section>
      )}

      {interview_readiness && (
        <section>
          <h3 className="font-semibold text-lg mb-1">
            Interview Readiness
          </h3>
          <p className="font-medium">{interview_readiness}</p>
        </section>
      )}

      {fix_first && (
        <section>
          <h3 className="font-semibold text-lg mb-1">
            Fix This First
          </h3>
          <p>{fix_first}</p>
        </section>
      )}

      {strengths.length > 0 && (
        <section>
          <h3 className="font-semibold text-lg mb-1">
            Strengths
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {strengths.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {gaps.length > 0 && (
        <section>
          <h3 className="font-semibold text-lg mb-1">
            Gaps to Address
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {gaps.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {ats_tips.length > 0 && (
        <section>
          <h3 className="font-semibold text-lg mb-1">
            ATS Tips
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {ats_tips.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
