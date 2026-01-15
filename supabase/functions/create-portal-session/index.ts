// supabase/functions/create-portal-session/index.ts

import Stripe from "npm:stripe";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SITE_URL = Deno.env.get("SITE_URL")!;

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
    });

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing auth header" }, 401);
    }

    const jwt = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(jwt);

    if (error || !user) {
      return json({ error: "Unauthorized" }, 401);
    }

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profileErr || !profile?.stripe_customer_id) {
      return json({ error: "Stripe customer not found" }, 400);
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${SITE_URL}/dashboard/billing`,
    });

    return json({ url: portalSession.url });
  } catch (err) {
    return json(
      {
        error: "Failed to create portal session",
        detail: String(err),
      },
      500
    );
  }
});
