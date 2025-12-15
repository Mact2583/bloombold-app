import React from "react";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

      <p className="text-gray-700">
        Welcome to BloomBold! Your career tools and insights will appear here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Resume Builder</h3>
          <p className="text-gray-600 mb-4">Create and update your resume with AI assistance.</p>
          <a href="/resume" className="text-indigo-600 font-medium hover:underline">
            Go to Resume Builder →
          </a>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Interview Simulator</h3>
          <p className="text-gray-600 mb-4">Practice interview questions and get feedback.</p>
          <a href="/interview" className="text-indigo-600 font-medium hover:underline">
            Try Interview Simulator →
          </a>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Career Journal</h3>
          <p className="text-gray-600 mb-4">Track your progress and career reflections.</p>
          <a href="/journal" className="text-indigo-600 font-medium hover:underline">
            Open Journal →
          </a>
        </div>

      </div>
    </div>
  );
}
