import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { PaymentAcknowledgment } from "@/components/payment/PaymentAcknowledgment";
import { CancellationWorkflow } from "@/components/payment/CancellationWorkflow";
import { TechOnlyDisclaimer } from "@/components/legal/TechOnlyDisclaimer";
import { Link } from "wouter";
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  Star,
  ExternalLink,
  AlertTriangle
} from "lucide-react";

interface BillingPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  popular?: boolean;
  current?: boolean;

}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl?: string;
}

const plans: BillingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    interval: 'month',
    features: [
      'Up to 50 protected images & videos',
      'Google Images & Videos monitoring',
      'Real-time alerts',
      'DMCA assistance',
      'Priority support'
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    interval: 'month',
    features: [
      'Unlimited protected images & videos',
      'Google + Bing Images & Videos monitoring',
      'Auto-DMCA generation',
      'Screenshot evidence',
      'Legal template library',
      'Dedicated support'
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Custom monitoring rules for images & videos',
      'API access',
      'White-label options',
      'Legal consultation',
      '24/7 support'
    ],
  },
];

const invoices: Invoice[] = [
  {
    id: 'inv_001',
    date: '2024-07-01',
    amount: 0,
    status: 'paid',
    description: 'Free Plan - July 2024',
  },
  {
    id: 'inv_002',
    date: '2024-06-01',
    amount: 0,
    status: 'paid',
    description: 'Free Plan - June 2024',
  },
];

export default function Billing() {
  const { toast } = useToast();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [currentPlan] = useState(plans.find(p => p.current));

  const handlePlanChange = (planId: string) => {
    toast({
      title: "Plan Change Initiated",
      description: "Redirecting to secure payment processing...",
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: "Your invoice is being downloaded.",
    });
  };

  const openCustomerPortal = () => {
    toast({
      title: "Opening Customer Portal",
      description: "Redirecting to Stripe® customer portal...",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-neon-green/20 text-neon-green">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-hot-pink/20 text-hot-pink">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getYearlyDiscount = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 10; // 2 months discount
    const savings = (monthlyPrice * 12) - yearlyPrice;
    return { yearlyPrice, savings };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gradient">Choose Your Plan</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Credit card required • Instant activation • Monthly billing
            </p>
          </div>
          <div className="flex space-x-4 mt-4 lg:mt-0">
            <Button onClick={openCustomerPortal} className="btn-electric">
              <CreditCard size={20} className="mr-2" />
              Manage Billing
            </Button>
            <Button className="btn-hot">
              <Download size={20} className="mr-2" />
              Download Invoice
            </Button>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <TechOnlyDisclaimer 
          context="billing" 
          prominent={true}
          showExternalLinks={true}
        />

        {/* Current Plan Overview */}
        <Card className="gradient-border mb-8">
          <div className="gradient-border-inner p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold text-white mb-2">Current Plan</h2>
                <div className="flex items-center space-x-4 mb-4">
                  <h3 className="text-2xl font-bold text-neon-cyan">
                    {currentPlan?.name} Plan
                  </h3>
                  <Badge className="bg-neon-green/20 text-neon-green">Active</Badge>
                </div>
                <p className="text-gray-400">
                  You're currently on the {currentPlan?.name} plan. 
                  {currentPlan?.price === 0 ? ' Upgrade to unlock more features.' : ' Thank you for your subscription!'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <DollarSign className="text-electric-blue" size={24} />
                  <span className="text-3xl font-bold text-white">
                    ${currentPlan?.price}
                  </span>
                  <span className="text-gray-400">/{currentPlan?.interval}</span>
                </div>
                <p className="text-gray-400 text-sm">Current billing</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Calendar className="text-neon-green" size={24} />
                  <span className="text-xl font-bold text-white">
                    {currentPlan?.price === 0 ? '∞' : 'Aug 1'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {currentPlan?.price === 0 ? 'No expiration' : 'Next billing'}
                </p>
              </div>
            </div>
            
            {/* Subscription Management - Only show if user has paid plan */}
            {currentPlan?.price > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">Subscription Management</h4>
                    <p className="text-sm text-gray-400">
                      Next billing: August 1, 2024 • ${currentPlan?.price}/{currentPlan?.interval}
                    </p>
                  </div>
                  <CancellationWorkflow
                    currentPlan={currentPlan?.name}
                    nextBillingDate="August 1, 2024"
                    amount={`$${currentPlan?.price}`}
                    onCancel={() => {
                      toast({
                        title: "Subscription Cancelled",
                        description: "Your subscription will not renew. Service continues until billing period ends.",
                      });
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <span className={`text-sm ${billingInterval === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
          Monthly
        </span>
        <Switch
          checked={billingInterval === 'yearly'}
          onCheckedChange={(checked) => setBillingInterval(checked ? 'yearly' : 'monthly')}
        />
        <span className={`text-sm ${billingInterval === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
          Yearly
        </span>
        <Badge className="bg-neon-green/20 text-neon-green ml-2">
          Save 17%
        </Badge>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => {
          const isCurrentPlan = plan.current;
          const { yearlyPrice, savings } = getYearlyDiscount(plan.price);
          const displayPrice = billingInterval === 'yearly' && plan.price > 0 
            ? yearlyPrice 
            : plan.price;
          const displayInterval = billingInterval === 'yearly' && plan.price > 0 
            ? 'year' 
            : plan.interval;

          return (
            <Card 
              key={plan.id} 
              className={`gradient-border ${plan.popular ? 'ring-2 ring-electric-blue' : ''} relative`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-electric-blue text-white">
                    <Star size={12} className="mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <div className="gradient-border-inner p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-3xl font-bold text-white">${displayPrice}</span>
                    <span className="text-gray-400">/{displayInterval}</span>
                  </div>
                  {billingInterval === 'yearly' && plan.price > 0 && (
                    <p className="text-neon-green text-sm mt-1">
                      Save ${savings}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="text-neon-green flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <Button
                    disabled
                    className="w-full bg-gray-700 text-gray-400 cursor-not-allowed"
                  >
                    Current Plan
                  </Button>
                ) : (
                  <PaymentAcknowledgment
                    planName={plan.name}
                    price={`$${displayPrice}`}
                    billingCycle={billingInterval}
                    onProceed={() => handlePlanChange(plan.id)}
                  >
                    <Button
                      className={`w-full ${
                        plan.popular ? 'btn-electric' : 'btn-hot'
                      }`}
                    >
                      Subscribe Now
                    </Button>
                  </PaymentAcknowledgment>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Billing History */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-xl font-bold text-white mb-4">Billing History</h2>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-charcoal/50 rounded-lg border border-gray-700"
                >
                  <div>
                    <h3 className="font-semibold text-white">{invoice.description}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(invoice.date).toLocaleDateString()} • Invoice #{invoice.id}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-white">${invoice.amount}</p>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Payment Method & Settings */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-xl font-bold text-white mb-4">Payment Settings</h2>
            
            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-3">Payment Method</h3>
              <div className="p-4 bg-charcoal/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="text-electric-blue" size={20} />
                    <div>
                      <p className="text-white font-medium">•••• •••• •••• 4242</p>
                      <p className="text-gray-400 text-sm">Expires 12/2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                    Update
                  </Button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Security & Trust</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 p-3 bg-charcoal/50 rounded-lg">
                  <Shield className="text-neon-green" size={16} />
                  <span className="text-gray-300 text-sm">Stripe® Secured</span>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-charcoal/50 rounded-lg">
                  <CheckCircle className="text-electric-blue" size={16} />
                  <span className="text-gray-300 text-sm">SSL Protected</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={openCustomerPortal}
                className="w-full border-gray-600 text-gray-300"
              >
                <ExternalLink size={16} className="mr-2" />
                Manage via Stripe® Portal
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Legal Compliance Footer */}
      <Card className="gradient-border mt-8">
        <div className="gradient-border-inner p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-amber-400 mt-1 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Important Legal Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <h4 className="font-semibold text-white mb-2">Payment Terms</h4>
                  <ul className="space-y-1">
                    <li>• All sales are final and non-refundable</li>
                    <li>• Automatic renewal until cancelled</li>
                    <li>• No prorated refunds for early cancellation</li>
                    <li>• Payment failure may result in service suspension</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Service Disclaimer</h4>
                  <ul className="space-y-1">
                    <li>• Technology tools only, no legal services</li>
                    <li>• No guarantee of legal outcomes</li>
                    <li>• User responsible for all legal decisions</li>
                    <li>• Service may be modified or discontinued</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-700">
                <Link href="/terms" className="text-blue-400 hover:underline text-sm">
                  Terms of Service
                </Link>
                <Link href="/refund-policy" className="text-blue-400 hover:underline text-sm">
                  Refund Policy
                </Link>
                <Link href="/privacy" className="text-blue-400 hover:underline text-sm">
                  Privacy Policy
                </Link>
                <a href="mailto:admin@klinkylinks.com" className="text-blue-400 hover:underline text-sm">
                  Legal Questions
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
