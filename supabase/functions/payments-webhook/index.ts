import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const env = (url.searchParams.get('env') || 'sandbox') as StripeEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("Received event:", event.type, "env:", env);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      case "invoice.payment_failed":
        console.log("Payment failed:", event.data.object.id);
        await handlePaymentFailed(event.data.object, env);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  console.log("Checkout completed:", session.id, "mode:", session.mode);
  
  const metadata = session.metadata || {};
  const amountTotal = session.amount_total || 0;

  const { error } = await supabase.from("payments").insert({
    customer_name: metadata.customerName || session.customer_details?.name || 'Inconnu',
    customer_email: session.customer_details?.email || metadata.customerEmail || '',
    customer_phone: metadata.customerPhone || session.customer_details?.phone || '',
    pack_name: metadata.packName || 'Pack',
    pack_id: metadata.priceId || '',
    price_id: metadata.priceId || '',
    amount: amountTotal,
    currency: session.currency || 'eur',
    status: 'completed',
    stripe_session_id: session.id,
    stripe_payment_intent_id: session.payment_intent || '',
    environment: env,
  });

  if (error) {
    console.error("Error inserting payment:", error);
  }
}

async function handlePaymentFailed(invoice: any, env: StripeEnv) {
  const customerEmail = invoice.customer_email || '';
  if (customerEmail) {
    const { error } = await supabase.from("payments").insert({
      customer_name: invoice.customer_name || 'Inconnu',
      customer_email: customerEmail,
      pack_name: 'Paiement échoué',
      amount: invoice.amount_due || 0,
      currency: invoice.currency || 'eur',
      status: 'failed',
      environment: env,
    });
    if (error) console.error("Error recording failed payment:", error);
  }
}
