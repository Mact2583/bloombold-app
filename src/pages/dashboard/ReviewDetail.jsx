import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import useProStatus from "@/hooks/useProStatus";

function safeParseJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function formatDate(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleString();
}

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm mb-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="text-gray-800">{children}</div>
    </div>
  );
}

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading: proLoading, isPro } = useProStatus();

  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const { data, error } = await supabase
          .from("resume_reviews")
          .select("id, created_at, resume_text, target_role, feedback")
          .eq("id", id)
          .single();

        if (!alive) return;

        if (error) {
          setError(error.message || "Unable to load review.");
          setReview(null);
        } else {
          setReview(data);
        }
      } catch (e) {
        if (!alive) return;
        setError("Unable to load review.");
        setReview(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [id]);

  const parsedFeedback = useMemo(() => {
    const fb = review?.feedback;
    if (!fb) return null;

    // feedback might already be JSON (object) or stringified JSON
    if (typeof fb === "object") return fb;
    if (typeof fb === "string") return safeParseJson(fb);

    return null;
  }, [review]);

  const renderedFeedback = useMemo(() => {
    if (!review) return null;

    // If JSON parses, render as sections
    if (parsedFeedback && typeof parsedFeedback === "object") {
      const entries = Object.entries(parsedFeedback);

      return (
        <div className="space-y-4">
          {entries.map(([key, value]) => {
            const title = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            if (Array.isArray(value)) {
              return (
                <Section key={key} title={title}>
                  <ul className="list-disc pl-5 space-y-1">
                    {value.map((item, idx) => (
                      <li key={idx}>{String(item)}</li>
                    ))}
                  </ul>
                </Section>
              );
            }

            return (
              <Section key={key} title={title}>
                <p className="leading-relaxed">{String(value)}</p>
              </Section>
            );
          })}
        </div>
      );
    }

    // Otherwise show raw feedback text, but readable
    return (
      <Section title="Feedback">
        <pre className="whitespace-pre-wrap text-sm bg-gray-50 border rounded-md p-4 overflow-auto">
          {typeof review.feedback === "string"
            ? review.feedback
            : JSON.stringify(review.feedback, null, 2)}
        </pre>
      </Section>
    );
  }, [review, parsedFeedback]);

  const handleExport = async () => {
    // Placeholder for your Phase 6 implementation.
    // For Phase 10 enforcement, we just gate it here.
    if (!isPro) {
      navigate("/dashboard/upgrade");
      return;
    }

    alert("PDF export hook goes here (Phase 6).");
  };

  if (loading || proLoading) {
    return <div className="p-10 text-center text-gray-500">Loading…</div>;
  }

  if (error) {
    return (
      <div className="p-10">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="p-10 text-center text-gray-500">
        Review not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Resume Review</h1>
          <p className="text-sm text-gray-600">
            {formatDate(review.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isPro && (
            <button
              onClick={() => navigate("/dashboard/upgrade")}
              className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Upgrade to Export
            </button>
          )}

          <button
            onClick={handleExport}
            className="bg-black text-white px-4 py-2 rounded-md hover:opacity-90"
          >
            Export PDF
          </button>
        </div>
      </div>

      <Section title="Target Role">
        <p className="text-gray-800">
          {review.target_role ? review.target_role : "—"}
        </p>
      </Section>

      <Section title="Original Resume Text">
        <pre className="whitespace-pre-wrap text-sm bg-gray-50 border rounded-md p-4 overflow-auto">
          {review.resume_text}
        </pre>
      </Section>

      {renderedFeedback}
    </div>
  );
}
