import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function ProGate({
  children,
  fallback = null,
  redirectTo = "/dashboard/upgrade",
  requirePro = true,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // ProtectedRoute should handle auth; just fail safe
          if (isMounted) {
            setIsPro(false);
            setLoading(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("is_pro")
          .eq("id", user.id)
          .single();

        if (error) {
          if (isMounted) {
            setIsPro(false);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setIsPro(Boolean(data?.is_pro));
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setIsPro(false);
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && requirePro && !isPro) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, requirePro, isPro, navigate, redirectTo]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Checking plan…
      </div>
    );
  }

  if (requirePro && !isPro) {
    return fallback;
  }

  return <>{children}</>;
}
