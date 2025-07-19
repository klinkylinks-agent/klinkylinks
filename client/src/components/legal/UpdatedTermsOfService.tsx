import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, CreditCard, AlertTriangle, Scale, Users, Settings } from "lucide-react";

export function UpdatedTermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <Card className="gradient-border p-6">
        <div className="gradient-border-inner">
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" size={24} />
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Technology Service Provider</h2>
              <p className="text-gray-300 leading-relaxed">
                KlinkyLinks provides technology tools for content similarity detection and template generation only. 
                We do not provide legal advice, make legal determinations, or guarantee legal outcomes. 
                All legal decisions and actions remain your sole responsibility.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="gradient-border p-6">
          <div className="gradient-border-inner">
            <div className="flex items-start gap-4">
              <CreditCard className="text-green-400 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Payment Terms</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• All payments are <strong>final and non-refundable</strong></li>
                  <li>• Automatic renewal unless cancelled</li>
                  <li>• No prorated refunds for early cancellation</li>
                  <li>• Payment failure may result in service suspension</li>
                  <li>• Price changes apply to next billing cycle</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        <Card className="gradient-border p-6">
          <div className="gradient-border-inner">
            <div className="flex items-start gap-4">
              <Users className="text-purple-400 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Account Termination</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• We may terminate accounts for ToS violations</li>
                  <li>• No refunds for terminated accounts</li>
                  <li>• Fraudulent activity results in immediate ban</li>
                  <li>• Data may be deleted upon termination</li>
                  <li>• Appeal process available for technical errors</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="gradient-border p-6">
        <div className="gradient-border-inner">
          <div className="flex items-start gap-4">
            <Scale className="text-blue-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Legal Disclaimers</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <p>
                  <strong>No Legal Advice:</strong> We provide technology tools only. Nothing on our platform 
                  constitutes legal advice or creates an attorney-client relationship.
                </p>
                <p>
                  <strong>No Outcome Guarantee:</strong> We do not guarantee the success of any DMCA notice, 
                  takedown request, or legal action taken using our templates or tools.
                </p>
                <p>
                  <strong>User Responsibility:</strong> You are solely responsible for determining the legality 
                  of your actions and ensuring compliance with applicable laws.
                </p>
                <p>
                  <strong>Limitation of Liability:</strong> Our liability is limited to the amount paid for 
                  services in the preceding 12 months, not to exceed $100.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="gradient-border p-6">
        <div className="gradient-border-inner">
          <div className="flex items-start gap-4">
            <Settings className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Service Modifications</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                We reserve the right to modify, suspend, or discontinue services at any time without notice. 
                No refunds will be provided for service modifications or discontinuation.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Continued use of our services after changes constitutes acceptance of modified terms.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="gradient-border p-6">
        <div className="gradient-border-inner">
          <h3 className="text-lg font-semibold text-white mb-4">Dispute Resolution</h3>
          <div className="space-y-3 text-gray-300 text-sm">
            <p>
              <strong>Binding Arbitration:</strong> Any disputes will be resolved through binding arbitration 
              in accordance with the rules of the American Arbitration Association.
            </p>
            <p>
              <strong>No Class Actions:</strong> You waive the right to participate in class action lawsuits 
              against us.
            </p>
            <p>
              <strong>Governing Law:</strong> These terms are governed by the laws of Delaware, United States.
            </p>
          </div>
        </div>
      </Card>

      <div className="text-center text-gray-400 text-sm">
        <p>
          By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
        </p>
        
      </div>
    </div>
  );
}