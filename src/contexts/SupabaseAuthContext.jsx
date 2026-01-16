import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  /**
   * 🔐 AUTH LOADING
   * This is the ONLY flag allowed to gate rendering.
   * It MUST always resolve.
   */
  const [loading, setLoading] = useState(true);

  /**
   * 💳 PROFILE FLAGS
   * These MUST NEVER block app render.
   */
  const [isPro, setIsPro] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Prevent double auth unlocks
  const authResolvedRef = useRef(false);

  // --------------------------------------------
  // Fetch profile flags (NON-BLOCKING)
  // --------------------------------------------
  const fetchProfileFlags = async (userId) => {
    if (!userId) return;

    setProfileLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_pro")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setIsPro(Boolean(data.is_pro));
      } else {
        setIsPro(false);
      }
    } catch {
      setIsPro(false);
    } finally {
      setProfileLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfileFlags(user.id);
    }
  };

  // --------------------------------------------
  // Init auth session (MUST always complete)
  // --------------------------------------------
  useEffect(() => {
    let mounted = true;
    let realtimeChannel = null;

    const resolveAuthOnce = () => {
      if (!authResolvedRef.current) {
        authResolvedRef.current = true;
        setLoading(false);
      }
    };

    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(session ?? null);
        setUser(session?.user ?? null);

        // 🔑 AUTH IS NOW RESOLVED — ALWAYS
        resolveAuthOnce();

        // Profile loads AFTER auth unlock
        if (session?.user?.id) {
          fetchProfileFlags(session.user.id);

          realtimeChannel = supabase
            .channel(`profiles_${session.user.id}`)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "profiles",
                filter: `id=eq.${session.user.id}`,
              },
              (payload) => {
                if (payload?.new?.is_pro !== undefined) {
                  setIsPro(Boolean(payload.new.is_pro));
                }
              }
            )
            .subscribe();
        }
      } catch {
        resolveAuthOnce();
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);

      resolveAuthOnce();

      if (nextSession?.user?.id) {
        fetchProfileFlags(nextSession.user.id);
      } else {
        setIsPro(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      loading,          // ONLY auth gate
      isPro,            // capability flag
      profileLoading,   // informational only
      refreshProfile,
    }),
    [session, user, loading, isPro, profileLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
