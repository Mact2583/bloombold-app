import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const PreviousReviews = ({ onSelect }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      const { data } = await supabase
        .from("resume_reviews")
        .select("id, created_at, results")
        .order("created_at", { ascending: false })
        .limit(5);

      setReviews(data || []);
    };

    loadReviews();
  }, []);

  if (!reviews.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">
        Previous Reviews
      </h3>
      <ul className="space-y-1">
        {reviews.map((r) => (
          <li key={r.id}>
            <button
              onClick={() => onSelect(r.results)}
              className="text-sm text-blue-600 hover:underline"
            >
              Resume Review –{" "}
              {new Date(r.created_at).toLocaleDateString()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PreviousReviews;
