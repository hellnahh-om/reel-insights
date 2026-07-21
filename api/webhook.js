import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = JSON.stringify(req.body);
  const signature = req.headers["x-signature"];
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (signature !== digest) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = req.body;
  const eventName = event.meta?.event_name;
  const userId = event.meta?.custom_data?.user_id;

  if (!userId) {
    return res.status(400).json({ error: "No user_id in custom data" });
  }

  if (eventName === "subscription_created" || eventName === "subscription_updated") {
    const status = event.data?.attributes?.status;
    const isActive = status === "active" || status === "on_trial";

    await supabaseAdmin
      .from("profiles")
      .upsert({ user_id: userId, is_subscribed: isActive }, { onConflict: "user_id" });
  }

  if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
    await supabaseAdmin
      .from("profiles")
      .upsert({ user_id: userId, is_subscribed: false }, { onConflict: "user_id" });
  }

  return res.status(200).json({ received: true });
}
