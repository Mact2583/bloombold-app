import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      flowType: "pkce",            // ✅ correct
      autoRefreshToken: true,      // ✅ correct
      persistSession: true,        // ✅ correct
      detectSessionInUrl: true,    // ✅ correct
      storage: window.localStorage // 🚨 THIS WAS MISSING
    },
  }
);




