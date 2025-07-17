import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, FileText, Shield, AlertTriangle, CheckCircle } from "lucide-react";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold">
            <span className="text-gradient">Terms of Service</span>
          </h1>
          <Badge className="bg-neon-green/20 text-neon-green">
            Last Updated: July 16, 2024
          </Badge>
        </div>
        <p className="text-gray-400 text-lg">
          These terms govern your use of KlinkyLinks content protection services. Please read them carefully.
        </p>
      </div>

      {/* Agreement Overview */}
      <Card className="gradient-border mb-8">
        <div className="gradient-border-inner p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Agreement Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-charcoal/50 rounded-lg">
              <Scale className="mx-auto text-electric-blue mb-2" size={32} />
              <h3 className="font-semibold text-white mb-1">Legal Agreement</h3>
              <p className="text-gray-400 text-sm">Binding contract between you and KlinkyLinks</p>
            </div>
            <div className="text-center p-4 bg-charcoal/50 rounded-lg">
              <Shield className="mx-auto text-neon-green mb-2" size={32} />
              <h3 className="font-semibold text-white mb-1">Service Protection</h3>
              <p className="text-gray-400 text-sm">Content monitoring and DMCA compliance tools</p>
            </div>
            <div className="text-center p-4 bg-charcoal/50 rounded-lg">
              <CheckCircle className="mx-auto text-neon-cyan mb-2" size={32} />
              <h3 className="font-semibold text-white mb-1">User Rights</h3>
              <p className="text-gray-400 text-sm">Your rights and responsibilities as a user</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Terms Content */}
      <div className="space-y-8">
        {/* Acceptance of Terms */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <div className="space-y-4 text-gray-400">
              <p>
                By accessing or using KlinkyLinks ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, do not use the Service.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and KlinkyLinks. Your use of the Service 
                signifies your acceptance of these Terms and our Privacy Policy.
              </p>
              <div className="p-4 bg-electric-blue/10 border border-electric-blue/30 rounded-lg">
                <p className="text-electric-blue text-sm">
                  <strong>Important:</strong> We may modify these Terms at any time. Continued use of the Service after 
                  changes constitutes acceptance of the modified Terms.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Service Description */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
            <div className="space-y-4">
              <p className="text-gray-400">
                KlinkyLinks provides automated content protection services including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Core Services</h3>
                  <ul className="text-gray-400 space-y-1 text-sm">
                    <li>• Content monitoring across search platforms</li>
                    <li>• Automated violation detection</li>
                    <li>• DMCA notice generation and management</li>
                    <li>• Legal template library</li>
                    <li>• Evidence collection and documentation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Platform Coverage</h3>
                  <ul className="text-gray-400 space-y-1 text-sm">
                    <li>• Google™ Images and Videos</li>
                    <li>• Bing® Images and Videos</li>
                    <li>• Social media platforms</li>
                    <li>• File sharing services</li>
                    <li>• Custom monitoring targets</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* User Obligations */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">3. User Obligations and Responsibilities</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Account Requirements</h3>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• Provide accurate and complete registration information</li>
                  <li>• Maintain the security of your account credentials</li>
                  <li>• Notify us immediately of any unauthorized access</li>
                  <li>• Be responsible for all activities under your account</li>
                  <li>• Use the Service only for lawful purposes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Content Ownership</h3>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• You must own or have rights to all content you upload</li>
                  <li>• Provide accurate ownership information for DMCA notices</li>
                  <li>• Not submit false or fraudulent copyright claims</li>
                  <li>• Respect others' intellectual property rights</li>
                  <li>• Comply with applicable copyright laws</li>
                </ul>
              </div>
              
              <div className="p-4 bg-hot-pink/10 border border-hot-pink/30 rounded-lg">
                <h3 className="text-hot-pink font-semibold mb-2">Prohibited Activities</h3>
                <p className="text-gray-300 text-sm">
                  You may not use the Service to submit false DMCA claims, harass others, violate laws, 
                  or interfere with Service operations. Violations may result in account termination.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* DMCA Compliance */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">4. DMCA Compliance and Copyright</h2>
            <div className="space-y-4">
              <p className="text-gray-400">
                KlinkyLinks operates in strict compliance with the Digital Millennium Copyright Act (DMCA). 
                Our Service includes human-in-the-loop approval to ensure all copyright claims are legitimate.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">DMCA Process</h3>
                  <ul className="text-gray-400 space-y-1 text-sm">
                    <li>• Automated content monitoring and detection</li>
                    <li>• Human review of all potential violations</li>
                    <li>• Legal notice generation with proper formatting</li>
                    <li>• User approval required before sending notices</li>
                    <li>• Tracking and documentation of all notices</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Good Faith Requirements</h3>
                  <ul className="text-gray-400 space-y-1 text-sm">
                    <li>• All DMCA notices must be submitted in good faith</li>
                    <li>• False claims may result in legal liability</li>
                    <li>• Perjury penalties apply to sworn statements</li>
                    <li>• Counter-notice procedures are available</li>
                    <li>• Repeat infringers may be terminated</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Terms */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">5. Payment Terms and Billing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Subscription Plans</h3>
                <p className="text-gray-400 text-sm mb-3">
                  KlinkyLinks offers various subscription tiers with different features and usage limits. 
                  All payments are processed securely through Stripe®.
                </p>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• Free plan with basic monitoring (up to 5 items)</li>
                  <li>• Paid plans with advanced features and higher limits</li>
                  <li>• Monthly and annual billing options available</li>
                  <li>• Automatic renewal unless cancelled</li>
                  <li>• Prorated charges for plan upgrades</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Payment Processing</h3>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• All payments processed by Stripe® (PCI DSS compliant)</li>
                  <li>• Automatic billing on subscription renewal dates</li>
                  <li>• Failed payments may result in service suspension</li>
                  <li>• Refunds processed according to our refund policy</li>
                  <li>• Price changes with 30-day advance notice</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Service Availability */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">6. Service Availability and Limitations</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Service Level</h3>
                <p className="text-gray-400 text-sm mb-3">
                  While we strive for high availability, we cannot guarantee uninterrupted service. 
                  We may need to perform maintenance, updates, or emergency repairs.
                </p>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• Best effort to maintain 99.9% uptime</li>
                  <li>• Scheduled maintenance with advance notice</li>
                  <li>• Emergency maintenance as needed</li>
                  <li>• Third-party service dependencies may affect availability</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h3 className="text-yellow-500 font-semibold mb-2 flex items-center">
                  <AlertTriangle size={16} className="mr-2" />
                  Service Limitations
                </h3>
                <p className="text-gray-300 text-sm">
                  Our monitoring depends on third-party search APIs and platforms. We cannot guarantee 
                  detection of all violations or successful DMCA takedowns, as these depend on platform policies.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Intellectual Property */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property Rights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">KlinkyLinks Property</h3>
                <p className="text-gray-400 text-sm mb-3">
                  The Service, including software, designs, text, and trademarks, is owned by KlinkyLinks 
                  and protected by intellectual property laws.
                </p>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• KlinkyLinks name and logo are our trademarks</li>
                  <li>• Service software and algorithms are proprietary</li>
                  <li>• User interfaces and designs are protected</li>
                  <li>• Documentation and help materials are copyrighted</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">User Content Rights</h3>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• You retain ownership of content you upload</li>
                  <li>• You grant us license to process content for protection services</li>
                  <li>• We do not claim ownership of your intellectual property</li>
                  <li>• You can delete your content and terminate the license</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Limitation of Liability */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                To the maximum extent permitted by law, KlinkyLinks shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages arising from your use of the Service.
              </p>
              
              <div className="p-4 bg-hot-pink/10 border border-hot-pink/30 rounded-lg">
                <h3 className="text-hot-pink font-semibold mb-2">Important Legal Disclaimer</h3>
                <ul className="text-gray-300 space-y-1 text-xs">
                  <li>• Service provided "as is" without warranties</li>
                  <li>• No guarantee of DMCA takedown success</li>
                  <li>• User responsible for legal compliance</li>
                  <li>• Total liability limited to fees paid in past 12 months</li>
                  <li>• Some jurisdictions may not allow these limitations</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Termination */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">By You</h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• Cancel subscription anytime through account settings</li>
                  <li>• Delete account and data through user controls</li>
                  <li>• Access continues through end of billing period</li>
                  <li>• Data deletion within 30 days of cancellation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">By KlinkyLinks</h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• Immediate termination for terms violations</li>
                  <li>• Suspension for payment issues</li>
                  <li>• 30-day notice for service discontinuation</li>
                  <li>• Account deletion for fraudulent DMCA claims</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Governing Law */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law and Disputes</h2>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                These Terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved 
                through binding arbitration or in courts of competent jurisdiction.
              </p>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Dispute Resolution</h3>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• Good faith negotiation as first step</li>
                  <li>• Binding arbitration for unresolved disputes</li>
                  <li>• Class action waiver (individual claims only)</li>
                  <li>• One-year limitation period for claims</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
            <p className="text-gray-400 text-sm mb-4">
              Questions about these Terms? Contact us:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-charcoal/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Legal Questions</h3>
                <div className="space-y-1 text-gray-400 text-sm">
                  <p>Email: legal@klinkylinks.com</p>
                  <p>Response time: 5 business days</p>
                </div>
              </div>
              
              <div className="p-4 bg-charcoal/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">General Support</h3>
                <div className="space-y-1 text-gray-400 text-sm">
                  <p>Email: support@klinkylinks.com</p>
                  <p>Response time: 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
