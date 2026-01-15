import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function useProStatus() {
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (alive) {
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

      if (!alive) return;

      if (error) {
        setIsPro(false);
      } else {
        setIsPro(Boolean(data?.is_pro));
      }

      setLoading(false);
    };

    run();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      run();
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return { loading, isPro };
}
