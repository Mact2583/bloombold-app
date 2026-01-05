import React, { useState } from "react";
import ResumeForm from "@/components/ResumeForm";
import ResumeResults from "@/components/ResumeResults";
import PreviousReviews from "@/components/PreviousReviews";

const ResumeReview = () => {
  const [results, setResults] = useState(null);

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">
            AI Resume Review
          </h1>
          <p className="text-muted-foreground">
            Get clear, ATS-aware feedback and track your progress.
          </p>
        </header>

        <PreviousReviews onSelect={setResults} />

        <ResumeForm onAnalyze={setResults} />

        <ResumeResults results={results} />
      </div>
    </div>
  );
};

export default ResumeReview;


