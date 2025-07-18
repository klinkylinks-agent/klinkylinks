import { Card } from "@/components/ui/card";
import { AlertTriangle, Shield, Clock } from "lucide-react";

export function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Refund Policy</h1>
        <p className="text-gray-400">Effective as of {new Date().toLocaleDateString()}</p>
      </div>

      <Card className="gradient-border p-6">
        <div className="gradient-border-inner">
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" size={24} />
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Important Notice</h2>
              <p className="text-gray-300 leading-relaxed">
                By using our services, you acknowledge and agree that <strong>all sales are final</strong> and 
                no refunds will be provided except where legally mandated by applicable consumer protection laws.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="gradient-border p-6">
          <div className="gradient-border-inner">
            <div className="flex items-start gap-4">
              <Shield className="text-blue-400 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Subscription Terms</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Monthly and annual subscriptions are <strong>non-refundable</strong></li>
                  <li>• Cancellation prevents future renewals only</li>
                  <li>• No prorated refunds for unused portions</li>
                  <li>• Service continues until end of current billing cycle</li>
                  <li>• Pre-purchased credits are non-refundable once acquired</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        <Card className="gradient-border p-6">
          <div className="gradient-border-inner">
            <div className="flex items-start gap-4">
              <Clock className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Service Delivery</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Technology tools provided as-is</li>
                  <li>• No guarantee of legal outcomes</li>
                  <li>• DMCA template success does not entitle refunds</li>
                  <li>• User responsible for all legal decisions</li>
                  <li>• Technical support available during subscription</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="gradient-border p-6">
        <div className="gradient-border-inner">
          <h3 className="text-lg font-semibold text-white mb-4">Legal Exceptions</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Refunds will only be considered in the following exceptional circumstances:
          </p>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• Demonstrable service outage preventing access for more than 72 consecutive hours</li>
            <li>• Critical technical malfunction preventing core functionality, unresolved for 7+ days</li>
            <li>• Legal requirements under applicable consumer protection laws in your jurisdiction</li>
            <li>• Account termination due to our technical error (not user violation)</li>
          </ul>
          <p className="text-gray-400 text-xs mt-4">
            All refund requests must be submitted in writing with supporting documentation. 
            Decisions are final and at our sole discretion.
          </p>
        </div>
      </Card>

      <Card className="gradient-border p-6">
        <div className="gradient-border-inner">
          <h3 className="text-lg font-semibold text-white mb-4">Chargeback Policy</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Initiating a chargeback without following our dispute resolution process may result in 
            immediate account termination and permanent ban from our services. We maintain comprehensive 
            records of service delivery and user acceptance of terms to defend against unauthorized chargebacks.
          </p>
        </div>
      </Card>
    </div>
  );
}