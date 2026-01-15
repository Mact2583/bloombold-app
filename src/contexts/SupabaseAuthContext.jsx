import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ This is the ONLY "auth is resolving" flag used by ProtectedRoute
  const [loading, setLoading] = useState(true);

  // Profile-driven flags
  const [isPro, setIsPro] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const channelRef = useRef(null);
  const mountedRef = useRef(true);

  const safeSet = (fn) => {
    if (mountedRef.current) fn();
  };

  const clearProfileState = () => {
    safeSet(() => {
      setIsPro(false);
      setProfileLoading(false);
    });
  };

  const removeProfileChannel = async () => {
    if (channelRef.current) {
      try {
        await supabase.removeChannel(channelRef.current);
      } catch {
        // ignore
      }
      channelRef.current = null;
    }
  };

  const subscribeToProfile = async (userId) => {
    await removeProfileChannel();

    channelRef.current = supabase
      .channel(`profiles_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const nextIsPro =
            payload?.new?.is_pro ?? payload?.record?.is_pro;

          if (typeof nextIsPro !== "undefined") {
            safeSet(() => setIsPro(Boolean(nextIsPro)));
          }
        }
      )
      .subscribe();
  };

  const fetchProfileFlags = async (userId) => {
    if (!userId) return;

    safeSet(() => setProfileLoading(true));

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, is_pro")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("fetchProfileFlags error:", error);
        safeSet(() => setIsPro(false));
        return;
      }

      safeSet(() => setIsPro(Boolean(data?.is_pro)));
    } catch (e) {
      console.error("fetchProfileFlags exception:", e);
      safeSet(() => setIsPro(false));
    } finally {
      safeSet(() => setProfileLoading(false));
    }
  };

  const refreshProfile = async () => {
    if (!user?.id) return;
    await fetchProfileFlags(user.id);
  };

  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      safeSet(() => setLoading(true));

      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        if (error) console.error("getSession error:", error);

        safeSet(() => {
          setSession(initialSession ?? null);
          setUser(initialSession?.user ?? null);
        });

        if (initialSession?.user?.id) {
          await fetchProfileFlags(initialSession.user.id);
          await subscribeToProfile(initialSession.user.id);
        } else {
          await removeProfileChannel();
          clearProfileState();
        }
      } catch (e) {
        console.error("init auth exception:", e);
        await removeProfileChannel();
        clearProfileState();
        safeSet(() => {
          setSession(null);
          setUser(null);
        });
      } finally {
        // ✅ CRITICAL: auth is now resolved
        safeSet(() => setLoading(false));
      }
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        // ✅ Ensure we never get stuck in "Checking session..."
        safeSet(() => setLoading(true));

        safeSet(() => {
          setSession(nextSession ?? null);
          setUser(nextSession?.user ?? null);
        });

        try {
          if (!nextSession?.user?.id) {
            await removeProfileChannel();
            clearProfileState();
            return;
          }

          await fetchProfileFlags(nextSession.user.id);
          await subscribeToProfile(nextSession.user.id);
        } catch (e) {
          console.error("onAuthStateChange exception:", e);
          await removeProfileChannel();
          clearProfileState();
        } finally {
          // ✅ CRITICAL: end auth resolving phase
          safeSet(() => setLoading(false));
        }
      }
    );

    return () => {
      mountedRef.current = false;
      authListener?.subscription?.unsubscribe?.();
      removeProfileChannel();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      isPro,
      profileLoading,
      refreshProfile,
    }),
    [session, user, loading, isPro, profileLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
