import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Calendar, CreditCard, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CancellationWorkflowProps {
  currentPlan: string;
  nextBillingDate: string;
  amount: string;
  onCancel: () => void;
}

export function CancellationWorkflow({ 
  currentPlan, 
  nextBillingDate, 
  amount, 
  onCancel 
}: CancellationWorkflowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const { toast } = useToast();

  const handleCancelConfirmation = () => {
    onCancel();
    setConfirmed(true);
    setStep(3);
    
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription will not auto-renew. Service continues until billing period ends.",
      duration: 5000,
    });
  };

  const resetDialog = () => {
    setStep(1);
    setConfirmed(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Cancel Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-red-400" size={20} />
            Cancel Subscription
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="text-blue-400" size={20} />
                <div>
                  <div className="font-semibold text-white">{currentPlan}</div>
                  <div className="text-sm text-gray-400">Next billing: {nextBillingDate}</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-400">{amount}</div>
            </div>

            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
              <h4 className="text-red-400 font-semibold mb-3">Before You Cancel</h4>
              <ul className="text-red-200 text-sm space-y-2">
                <li>• <strong>No refund will be issued</strong> for your current billing period</li>
                <li>• Service continues until {nextBillingDate}</li>
                <li>• You'll lose access to all premium features after that date</li>
                <li>• Any generated templates or data may be deleted</li>
                <li>• You can reactivate anytime (at current pricing)</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={resetDialog} className="flex-1">
                Keep Subscription
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setStep(2)}
                className="flex-1"
              >
                Continue Cancellation
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Final Confirmation</h3>
              <p className="text-gray-300">
                Are you absolutely sure you want to cancel your subscription?
              </p>
            </div>

            <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
              <h4 className="text-amber-400 font-semibold mb-3">Important Reminders</h4>
              <ul className="text-amber-200 text-sm space-y-1">
                <li>• <strong>This action cannot be undone</strong></li>
                <li>• <strong>No refund</strong> for remaining {nextBillingDate}</li>
                <li>• Service active until {nextBillingDate} only</li>
                <li>• All premium features will be lost</li>
                <li>• Future reactivation at current market rates</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <X className="mr-2" size={16} />
                Go Back
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelConfirmation}
                className="flex-1"
              >
                Yes, Cancel Subscription
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <div>
              <CheckCircle className="text-green-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Subscription Cancelled</h3>
              <p className="text-gray-300">
                Your subscription has been successfully cancelled and will not auto-renew.
              </p>
            </div>

            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-3">What Happens Next</h4>
              <ul className="text-blue-200 text-sm space-y-2 text-left">
                <li>• Your service remains active until <strong>{nextBillingDate}</strong></li>
                <li>• No charges will occur after the current billing period</li>
                <li>• You'll receive a confirmation email shortly</li>
                <li>• You can reactivate anytime from your account settings</li>
                <li>• Your account data will be preserved for 30 days after expiration</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={resetDialog} className="flex-1">
                Close
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => window.location.href = "/"}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}