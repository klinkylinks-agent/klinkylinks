import { Card } from "@/components/ui/card";
import { AlertTriangle, Shield, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface TechOnlyDisclaimerProps {
  context?: string;
  prominent?: boolean;
  showExternalLinks?: boolean;
}

export function TechOnlyDisclaimer({ 
  context = "general", 
  prominent = false, 
  showExternalLinks = false 
}: TechOnlyDisclaimerProps) {
  const contextMessages = {
    billing: "Before making any payments, please understand that this service provides technology tools only.",
    monitoring: "This monitoring service detects content similarities using technical analysis only.",
    dmca: "DMCA template generation is a technology service - all legal decisions remain your responsibility.",
    general: "This platform provides technology tools for content analysis and template generation only."
  };

  const message = contextMessages[context] || contextMessages.general;

  return (
    <Card className={`gradient-border ${prominent ? 'mb-6' : 'mb-4'}`}>
      <div className="gradient-border-inner p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-400 mt-1 flex-shrink-0" size={20} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-blue-400" size={16} />
              <h4 className="font-semibold text-white text-sm">Technology Service Notice</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              {message} <strong>We do not provide legal advice, make legal determinations, or guarantee legal outcomes.</strong> 
              All legal decisions and actions remain your sole responsibility.
            </p>
            
            {showExternalLinks && (
              <div className="flex flex-wrap gap-3 text-xs">
                <Link href="/terms" className="text-blue-400 hover:underline flex items-center gap-1">
                  <ExternalLink size={12} />
                  Terms of Service
                </Link>
                <Link href="/refund-policy" className="text-blue-400 hover:underline flex items-center gap-1">
                  <ExternalLink size={12} />
                  Refund Policy
                </Link>
                <a href="mailto:admin@klinkylinks.com" className="text-blue-400 hover:underline flex items-center gap-1">
                  <ExternalLink size={12} />
                  Legal Questions
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}