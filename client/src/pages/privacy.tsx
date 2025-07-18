import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Database, Mail } from "lucide-react";

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold">
            <span className="text-gradient">Privacy Policy</span>
          </h1>
          <Badge className="bg-neon-green/20 text-neon-green">
            Last Updated: July 16, 2024
          </Badge>
        </div>
        <p className="text-gray-400 text-lg">
          Your privacy is important to us. This policy explains how KlinkyLinks collects, uses, and protects your information.
        </p>
      </div>

      {/* Key Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="gradient-border">
          <div className="gradient-border-inner p-4 text-center">
            <Shield className="mx-auto text-neon-green mb-2" size={32} />
            <h3 className="font-semibold text-white mb-1">Data Protection</h3>
            <p className="text-gray-400 text-sm">We never sell your personal data to third parties</p>
          </div>
        </Card>
        
        <Card className="gradient-border">
          <div className="gradient-border-inner p-4 text-center">
            <Lock className="mx-auto text-electric-blue mb-2" size={32} />
            <h3 className="font-semibold text-white mb-1">Secure Storage</h3>
            <p className="text-gray-400 text-sm">All data encrypted with industry-standard security</p>
          </div>
        </Card>
        
        <Card className="gradient-border">
          <div className="gradient-border-inner p-4 text-center">
            <Eye className="mx-auto text-neon-cyan mb-2" size={32} />
            <h3 className="font-semibold text-white mb-1">Transparency</h3>
            <p className="text-gray-400 text-sm">Clear information about how we use your data</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Information We Collect */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Account Information</h3>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• Name and email address</li>
                  <li>• Username and profile information</li>
                  <li>• Billing and payment information (processed securely by Stripe®)</li>
                  <li>• Communication preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Content Information</h3>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• Files you upload for protection monitoring</li>
                  <li>• Content metadata (titles, descriptions, tags)</li>
                  <li>• Digital fingerprints and content signatures</li>
                  <li>• Monitoring results and violation reports</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Usage Information</h3>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• Service usage patterns and feature interactions</li>
                  <li>• Log data including IP addresses and timestamps</li>
                  <li>• Device and browser information</li>
                  <li>• Performance and error reporting data</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* How We Use Information */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Service Operations</h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• Provide content protection monitoring</li>
                  <li>• Generate and send DMCA notices</li>
                  <li>• Process payments and manage subscriptions</li>
                  <li>• Provide customer support</li>
                  <li>• Send service-related notifications</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Service Improvement</h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• Analyze usage patterns to improve features</li>
                  <li>• Detect and prevent fraud or abuse</li>
                  <li>• Maintain security and system integrity</li>
                  <li>• Develop new features and services</li>
                  <li>• Comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Information Sharing */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing and Disclosure</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-lg">
                <h3 className="text-lg font-semibold text-neon-green mb-2">We Do Not Sell Your Data</h3>
                <p className="text-gray-300 text-sm">
                  KlinkyLinks never sells, rents, or trades your personal information to third parties for marketing purposes.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Limited Sharing</h3>
                <p className="text-gray-400 text-sm mb-3">We may share information only in these specific circumstances:</p>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• <strong>Service Providers:</strong> Trusted partners who help operate our service (Stripe® for payments, AWS® for hosting)</li>
                  <li>• <strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights</li>
                  <li>• <strong>DMCA Notices:</strong> Information necessary for valid copyright enforcement</li>
                  <li>• <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                  <li>• <strong>Consent:</strong> When you explicitly authorize us to share information</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Security */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Technical Safeguards</h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• End-to-end encryption for data transmission</li>
                  <li>• AES-256 encryption for data at rest</li>
                  <li>• Secure cloud infrastructure (AWS®)</li>
                  <li>• Regular security audits and monitoring</li>
                  <li>• Multi-factor authentication support</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Operational Security</h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• Limited employee access to user data</li>
                  <li>• Regular staff security training</li>
                  <li>• Incident response procedures</li>
                  <li>• Secure development practices</li>
                  <li>• Third-party security assessments</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Your Rights */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Privacy Rights</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Access and Control</h3>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• Access and review your personal information</li>
                  <li>• Update or correct your account information</li>
                  <li>• Download your data in a portable format</li>
                  <li>• Delete your account and associated data</li>
                  <li>• Opt out of marketing communications</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Regional Rights</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Depending on your location, you may have additional rights under:
                </p>
                <ul className="text-gray-400 space-y-1 text-sm ml-4">
                  <li>• GDPR (European Union)</li>
                  <li>• CCPA (California, USA)</li>
                  <li>• PIPEDA (Canada)</li>
                  <li>• Other applicable privacy laws</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Retention */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
            
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">
                We retain your information only as long as necessary to provide our services and comply with legal obligations:
              </p>
              
              <ul className="text-gray-400 space-y-1 text-sm ml-4">
                <li>• <strong>Account Data:</strong> Until you delete your account</li>
                <li>• <strong>Content Files:</strong> Until you remove them or delete your account</li>
                <li>• <strong>Monitoring Data:</strong> Up to 2 years for service improvement</li>
                <li>• <strong>DMCA Records:</strong> As required by law (typically 3+ years)</li>
                <li>• <strong>Payment Records:</strong> As required for tax and legal compliance</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
            
            <div className="space-y-4">
              <p className="text-gray-400">
                If you have questions about this Privacy Policy or want to exercise your privacy rights, please contact us:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-charcoal/50 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Privacy Questions</h3>
                  <div className="space-y-1 text-gray-400 text-sm">
                    <p className="flex items-center space-x-2">
                      <Mail size={14} />
                      <span>admin@klinkylinks.com</span>
                    </p>
                    <p>Response time: 48 hours</p>
                  </div>
                </div>
                
                <div className="p-4 bg-charcoal/50 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Data Protection Officer</h3>
                  <div className="space-y-1 text-gray-400 text-sm">
                    <p className="flex items-center space-x-2">
                      <Mail size={14} />
                      <span>admin@klinkylinks.com</span>
                    </p>
                    <p>For formal privacy requests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Updates */}
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold text-white mb-4">8. Policy Updates</h2>
            
            <p className="text-gray-400 text-sm mb-4">
              We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. 
              When we make significant changes, we will:
            </p>
            
            <ul className="text-gray-400 space-y-1 text-sm ml-4 mb-4">
              <li>• Send you email notification (if you have an account)</li>
              <li>• Display a prominent notice on our website</li>
              <li>• Update the "Last Updated" date at the top of this policy</li>
              <li>• Provide a 30-day notice period for material changes</li>
            </ul>
            
            <div className="p-4 bg-electric-blue/10 border border-electric-blue/30 rounded-lg">
              <p className="text-electric-blue text-sm">
                <strong>Your continued use of KlinkyLinks after policy updates constitutes acceptance of the revised terms.</strong>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
