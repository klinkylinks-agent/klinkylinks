import { useState } from "react";
import { AlertTriangle, Check, ExternalLink, Shield, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

interface UserResponsibilityModalProps {
  children: React.ReactNode;
  onAccept: () => void;
  title: string;
  description: string;
  requiresTyping?: boolean;
  confirmationText?: string;
}

export default function UserResponsibilityModal({
  children,
  onAccept,
  title,
  description,
  requiresTyping = false,
  confirmationText = "I understand"
}: UserResponsibilityModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [typedConfirmation, setTypedConfirmation] = useState("");
  const [confirmationStep, setConfirmationStep] = useState(0);

  const responsibilities = [
    "I understand this system provides technology tools only, not legal advice",
    "I will make all legal determinations regarding copyright infringement myself",
    "I will complete all template fields and ensure accuracy before submission",
    "I assume full legal responsibility for all notices I submit",
    "I understand I may be liable for perjury if I submit false information",
    "I will consult qualified legal counsel if I need legal advice"
  ];

  const handleAccept = () => {
    if (requiresTyping && typedConfirmation.toLowerCase() !== confirmationText.toLowerCase()) {
      return;
    }
    
    if (acceptedTerms) {
      onAccept();
      setIsOpen(false);
      // Reset state
      setAcceptedTerms(false);
      setTypedConfirmation("");
      setConfirmationStep(0);
    }
  };

  const canProceed = acceptedTerms && (!requiresTyping || typedConfirmation.toLowerCase() === confirmationText.toLowerCase());

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Warning */}
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong>Legal Responsibility Warning:</strong> By proceeding, you acknowledge that you are acting as your own authorized agent 
              and assume all legal responsibility for your actions. KlinkyLinks provides technology tools only.
            </AlertDescription>
          </Alert>

          {/* Responsibilities Checklist */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Your Legal Responsibilities
            </h3>
            <div className="space-y-2">
              {responsibilities.map((responsibility, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded bg-slate-800/50">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{responsibility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* External Resources */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">External Legal Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                onClick={() => window.open('https://www.copyright.gov/dmca/', '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                U.S. Copyright Office
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                onClick={() => window.open('https://www.americanbar.org/groups/legal_services/flh-home/', '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                Find Legal Help
              </Button>
            </div>
          </div>

          {/* Acceptance */}
          <div className="space-y-4 border-t border-gray-700 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="accept-terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <Label htmlFor="accept-terms" className="text-sm text-gray-300">
                I have read and understood all responsibilities listed above, and I accept full legal responsibility for my actions.
              </Label>
            </div>

            {requiresTyping && acceptedTerms && (
              <div className="space-y-2">
                <Label htmlFor="confirmation" className="text-sm text-gray-300">
                  Type "{confirmationText}" to confirm you understand:
                </Label>
                <Input
                  id="confirmation"
                  value={typedConfirmation}
                  onChange={(e) => setTypedConfirmation(e.target.value)}
                  placeholder={confirmationText}
                  className="bg-slate-800 border-gray-600 text-white"
                />
              </div>
            )}

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAccept}
                disabled={!canProceed}
                className={`${canProceed 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                I Accept All Legal Responsibility
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}