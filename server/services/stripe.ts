import Stripe from "stripe";
import { storage } from "../storage";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  priceId: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Up to 5 protected items',
      'Basic monitoring',
      'Email notifications',
      'Community support'
    ],
    priceId: '',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    features: [
      'Up to 50 protected items',
      'Advanced monitoring',
      'Real-time alerts',
      'DMCA assistance',
      'Priority support'
    ],
    priceId: process.env.STRIPE_BASIC_PRICE_ID || '',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    features: [
      'Unlimited protected items',
      'Multi-platform monitoring',
      'Auto-DMCA generation',
      'Screenshot evidence',
      'Legal template library',
      'Dedicated support'
    ],
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    features: [
      'Everything in Pro',
      'Custom monitoring rules',
      'API access',
      'White-label options',
      'Legal consultation',
      '24/7 support'
    ],
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
  },
];

export async function createSubscription(userId: number, email: string, priceId: string) {
  try {
    // Create or get Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: { userId: userId.toString() },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Update user in database
    await storage.updateUserStripeInfo(userId, customer.id, subscription.id);

    return {
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      customer: customer.id,
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new Error('Failed to create subscription');
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

export async function getCustomerPortalUrl(customerId: string, returnUrl: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw new Error('Failed to create portal session');
  }
}

export async function handleWebhookEvent(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user by customer ID
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) return;
        
        const userId = parseInt((customer as Stripe.Customer).metadata.userId);
        if (!userId) return;

        // Update subscription status
        const status = subscription.status;
        const tier = subscription.items.data[0]?.price.lookup_key || 'free';
        
        await storage.updateUserSubscription(userId, status, tier);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment succeeded for invoice:', invoice.id);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('Payment failed for invoice:', failedInvoice.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
}

export async function getSubscriptionDetails(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'items.data.price'],
    });
    return subscription;
  } catch (error) {
    console.error('Error getting subscription details:', error);
    return null;
  }
}
