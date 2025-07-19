import { buffer } from "micro";
import Stripe from "stripe";
import { storage } from "../storage";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" });

export default async function webhookHandler(req: any, res: any) {
  const sig = req.headers["stripe-signature"]!;
  const buf = await buffer(req);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature error:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      await storage.handleCheckoutSession(session);
      break;
    case "invoice.paid":
      const invoice = event.data.object as Stripe.Invoice;
      await storage.handleInvoicePaid(invoice);
      break;
    // … other event types …
    default:
      console.log(`Unhandled stripe event: ${event.type}`);
  }

  res.json({ received: true });
}
