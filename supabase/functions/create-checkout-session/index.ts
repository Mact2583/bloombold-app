// supabase/functions/create-checkout-session/index.ts

import Stripe from "npm:stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* =====================================================
   CORS
===================================================== */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

/* =====================================================
   MAIN
===================================================== */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    /* -----------------------------
       Auth
    ----------------------------- */
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return json({ error: "Unauthorized" }, 401);
    }

    /* -----------------------------
       Safe body parse
    ----------------------------- */
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const plan = body.plan === "annual" ? "annual" : "monthly";

    const priceId =
      plan === "annual"
        ? Deno.env.get("STRIPE_PRICE_ID_ANNUAL")
        : Deno.env.get("STRIPE_PRICE_ID_MONTHLY");

    if (!priceId) {
      throw new Error("Missing Stripe price ID");
    }

    /* -----------------------------
       Stripe
    ----------------------------- */
    const stripe = new Stripe(
      Deno.env.get("STRIPE_SECRET_KEY")!,
      { apiVersion: "2024-12-18.acacia" }
    );

    const SITE_URL = Deno.env.get("SITE_URL")!;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email ?? undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/dashboard?upgrade=success`,
      cancel_url: `${SITE_URL}/dashboard/upgrade`,
      metadata: {
        user_id: user.id,
        plan,
      },
    });

    return json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return json(
      { error: "Unable to start checkout" },
      500
    );
  }
});
