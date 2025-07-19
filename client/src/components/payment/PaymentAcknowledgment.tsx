import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, ExternalLink, Shield, CreditCard } from "lucide-react";
import { Link } from "wouter";

interface PaymentAcknowledgmentProps {
  planName: string;
  price: string;
  billingCycle: "monthly" | "annual";
  onProceed: () => void;
  isProcessing?: boolean;
  children: React.ReactNode;
}

export function PaymentAcknowledgment({ 
  planName, 
  price, 
  billingCycle, 
  onProceed, 
  isProcessing = false,
  children 
}: PaymentAcknowledgmentProps) {
  const [acknowledgedTerms, setAcknowledgedTerms] = useState(false);
  const [acknowledgedRefund, setAcknowledgedRefund] = useState(false);
  const [acknowledgedTechOnly, setAcknowledgedTechOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const canProceed = acknowledgedTerms && acknowledgedRefund && acknowledgedTechOnly;

  const handleProceed = () => {
    onProceed();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment Acknowledgment Required</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto">
        <div className="flex items-start gap-4 mb-6">
          <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Payment Acknowledgment Required</h3>
            <p className="text-gray-300 text-sm">
              Credit card required for instant activation. Monthly billing begins immediately. Please read and acknowledge the following before proceeding.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="text-green-400" size={20} />
            <span className="text-lg font-semibold text-white">{planName}</span>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1">{price}</div>
          <div className="text-sm text-gray-400">
            Billed {billingCycle} • Auto-renewal • Non-refundable
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <Checkbox 
              id="terms" 
              checked={acknowledgedTerms}
              onCheckedChange={(checked) => setAcknowledgedTerms(checked === true)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
              I have read, understood, and agree to the{" "}
              <Link href="/terms" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                Terms of Service
                <ExternalLink size={12} />
              </Link>
              {" "}and acknowledge that this is a technology service only, with no legal advice or outcome guarantees.
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox 
              id="refund" 
              checked={acknowledgedRefund}
              onCheckedChange={(checked) => setAcknowledgedRefund(checked === true)}
              className="mt-1"
            />
            <label htmlFor="refund" className="text-sm text-gray-300 leading-relaxed">
              I understand and agree to the{" "}
              <Link href="/refund-policy" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                Refund Policy
                <ExternalLink size={12} />
              </Link>
              {" "}that <strong>all payments are final and non-refundable</strong>, with no prorated refunds for cancellation.
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox 
              id="tech-only" 
              checked={acknowledgedTechOnly}
              onCheckedChange={(checked) => setAcknowledgedTechOnly(checked === true)}
              className="mt-1"
            />
            <label htmlFor="tech-only" className="text-sm text-gray-300 leading-relaxed">
              I understand that I am solely responsible for all legal decisions and actions, including determining 
              whether detected similarity matches constitute copyright infringement and whether to pursue legal action.
            </label>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="text-amber-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-amber-400 font-semibold mb-2">Important Reminder</h4>
              <ul className="text-amber-200 text-sm space-y-1">
                <li>• This service provides technology tools, not legal services</li>
                <li>• No guarantee of DMCA notice success or legal outcomes</li>
                <li>• Instant activation with valid credit card</li>
                <li>• Monthly billing begins immediately</li>
                <li>• Subscription will auto-renew unless cancelled</li>
                <li>• Cancellation only prevents future renewals</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={handleProceed} 
            disabled={!canProceed || isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Processing...
              </>
            ) : (
              `Subscribe Now - ${price}`
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          By clicking "Subscribe Now", you confirm your acceptance of all terms and acknowledge 
          that your card will be charged immediately for the subscription.
        </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}