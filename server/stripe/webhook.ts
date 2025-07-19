import { Express, Request, Response } from 'express';
import express from 'express';
import Stripe from 'stripe';
import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { storage } from '../storage';

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export function setupStripeWebhooks(app: Express) {
  // Webhook endpoint needs raw body, not JSON parsed
  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    
    if (!sig) {
      console.error('[STRIPE] Missing stripe-signature header');
      return res.status(400).send('Missing signature');
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      if (config.STRIPE_WEBHOOK_SECRET) {
        event = stripe.webhooks.constructEvent(req.body, sig, config.STRIPE_WEBHOOK_SECRET);
      } else {
        // In development, parse without verification
        event = JSON.parse(req.body.toString());
        console.warn('[STRIPE] Webhook signature verification disabled - development mode');
      }
    } catch (err: any) {
      console.error('[STRIPE] Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('[STRIPE] Received webhook event:', event.type);

    try {
      switch (event.type) {
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.payment_succeeded':
          await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case 'customer.subscription.trial_will_end':
          await handleTrialWillEnd(event.data.object as Stripe.Subscription);
          break;

        default:
          console.log('[STRIPE] Unhandled event type:', event.type);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('[STRIPE] Webhook handler error:', error);
      res.status(500).send('Webhook handler failed');
    }
  });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('[STRIPE] Subscription created:', subscription.id);
  
  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    
    if (customer.metadata?.userId) {
      await storage.updateUserSubscription(customer.metadata.userId, {
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionTier: 'premium',
        customerId: customer.id,
      });
      console.log('[STRIPE] User subscription updated:', customer.metadata.userId);
    }
  } catch (error) {
    console.error('[STRIPE] Failed to handle subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('[STRIPE] Subscription updated:', subscription.id, 'Status:', subscription.status);
  
  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    
    if (customer.metadata?.userId) {
      const subscriptionTier = subscription.status === 'active' ? 'premium' : 'free';
      
      await storage.updateUserSubscription(customer.metadata.userId, {
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionTier,
        customerId: customer.id,
      });
      console.log('[STRIPE] User subscription status updated:', customer.metadata.userId, subscription.status);
    }
  } catch (error) {
    console.error('[STRIPE] Failed to handle subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('[STRIPE] Subscription deleted:', subscription.id);
  
  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    
    if (customer.metadata?.userId) {
      await storage.updateUserSubscription(customer.metadata.userId, {
        subscriptionId: null,
        subscriptionStatus: 'canceled',
        subscriptionTier: 'free',
        customerId: customer.id,
      });
      console.log('[STRIPE] User subscription canceled:', customer.metadata.userId);
    }
  } catch (error) {
    console.error('[STRIPE] Failed to handle subscription deleted:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('[STRIPE] Payment succeeded:', invoice.id, 'Amount:', invoice.amount_paid);
  
  try {
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
      
      if (customer.metadata?.userId) {
        // Extend user's subscription period
        await storage.updateUserSubscription(customer.metadata.userId, {
          subscriptionStatus: 'active',
          subscriptionTier: 'premium',
          lastPaymentDate: new Date(),
        });
        console.log('[STRIPE] User subscription renewed:', customer.metadata.userId);
      }
    }
  } catch (error) {
    console.error('[STRIPE] Failed to handle payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('[STRIPE] Payment failed:', invoice.id, 'Customer:', invoice.customer);
  
  try {
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
      
      if (customer.metadata?.userId) {
        // Mark subscription as past due
        await storage.updateUserSubscription(customer.metadata.userId, {
          subscriptionStatus: 'past_due',
          subscriptionTier: 'free', // Downgrade until payment resolves
        });
        
        // TODO: Send email notification to user about failed payment
        console.log('[STRIPE] User subscription marked past due:', customer.metadata.userId);
      }
    }
  } catch (error) {
    console.error('[STRIPE] Failed to handle payment failed:', error);
  }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  console.log('[STRIPE] Trial will end:', subscription.id, 'End date:', subscription.trial_end);
  
  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    
    if (customer.metadata?.userId) {
      // TODO: Send email notification about trial ending
      console.log('[STRIPE] Trial ending notification for user:', customer.metadata.userId);
    }
  } catch (error) {
    console.error('[STRIPE] Failed to handle trial will end:', error);
  }
}

// Rate limiting middleware specifically for webhooks
export const webhookRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many webhook requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});