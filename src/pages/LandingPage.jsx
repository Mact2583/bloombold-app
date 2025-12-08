import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1>Welcome to BloomBold</h1>

      <p>Your smart career & growth tools start here.</p>

      <Link to="/login" className="btn">
        Get Started
      </Link>
    </div>
  );
};

export default LandingPage;
