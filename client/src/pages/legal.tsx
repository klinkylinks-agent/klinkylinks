import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Scale, FileText, Shield, Mail, ExternalLink } from "lucide-react";

export default function Legal() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Legal Information</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Important legal documents and compliance information for KlinkyLinks users
        </p>
      </div>

      {/* Legal Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="text-electric-blue" size={24} />
              <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Learn how we collect, use, and protect your personal information and data.
            </p>
            <div className="flex items-center justify-between">
              <Badge className="bg-neon-green/20 text-neon-green">Updated: July 16, 2024</Badge>
              <Link href="/privacy">
                <Button className="btn-electric">
                  Read Policy
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="gradient-border">
          <div className="gradient-border-inner p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="text-neon-cyan" size={24} />
              <h2 className="text-xl font-bold text-white">Terms of Service</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Understand your rights and responsibilities when using KlinkyLinks services.
            </p>
            <div className="flex items-center justify-between">
              <Badge className="bg-neon-green/20 text-neon-green">Updated: July 16, 2024</Badge>
              <Link href="/terms">
                <Button className="btn-electric">
                  Read Terms
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* DMCA Information */}
      <Card className="gradient-border mb-8">
        <div className="gradient-border-inner p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="text-hot-pink" size={24} />
            <h2 className="text-xl font-bold text-white">DMCA Compliance</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Our DMCA Policy</h3>
              <p className="text-gray-400 mb-4">
                KlinkyLinks is committed to respecting intellectual property rights and complying with the Digital Millennium Copyright Act (DMCA). We provide tools to help creators protect their content while maintaining full legal compliance.
              </p>
              
              <h4 className="text-md font-semibold text-white mb-2">Key Points:</h4>
              <ul className="text-gray-400 text-sm space-y-1 mb-4">
                <li>• Human-in-the-loop approval required for all DMCA notices</li>
                <li>• Automated content monitoring across major platforms</li>
                <li>• Legal template library with compliant notice formats</li>
                <li>• Evidence collection and documentation support</li>
                <li>• Counter-notice handling and response tracking</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Designated Agent</h3>
              <div className="bg-charcoal/50 rounded-lg p-4 mb-4">
                <p className="text-white font-medium">KlinkyLinks Legal Department</p>
                <p className="text-gray-400 text-sm">DMCA Designated Agent</p>
                <p className="text-gray-400 text-sm mt-2">
                  Email: dmca@klinkylinks.com<br />
                  Address: [Your Business Address]<br />
                  Phone: [Your Business Phone]
                </p>
              </div>
              
              <h4 className="text-md font-semibold text-white mb-2">Report Copyright Infringement</h4>
              <p className="text-gray-400 text-sm mb-3">
                If you believe your copyrighted work has been infringed, please contact our designated agent with the required DMCA information.
              </p>
              
              <Button variant="outline" className="border-gray-600 text-gray-300">
                <Mail size={16} className="mr-2" />
                Contact DMCA Agent
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Trademark Information */}
      <Card className="gradient-border mb-8">
        <div className="gradient-border-inner p-6">
          <h2 className="text-xl font-bold text-white mb-4">Trademark Information</h2>
          
          <div className="space-y-4 text-gray-400">
            <p>
              <strong className="text-white">KlinkyLinks</strong> and the KlinkyLinks logo are trademarks of [Your Company Name], registered in the United States and other countries.
            </p>
            
            <h3 className="text-lg font-semibold text-white">Third-Party Trademarks</h3>
            <p>
              The following trademarks are the property of their respective owners and are used in this service for identification purposes only:
            </p>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li>• Google™ is a trademark of Google LLC</li>
              <li>• Bing® is a trademark of Microsoft Corporation</li>
              <li>• Stripe® is a trademark of Stripe, Inc.</li>
              <li>• Facebook® is a trademark of Meta Platforms, Inc.</li>
              <li>• Instagram® is a trademark of Meta Platforms, Inc.</li>
              <li>• YouTube™ is a trademark of Google LLC</li>
              <li>• Twitter® is a trademark of Twitter, Inc.</li>
              <li>• TikTok® is a trademark of ByteDance Ltd.</li>
            </ul>
            
            <p className="text-xs text-gray-500 mt-4">
              All trademarks are used for nominative fair use purposes to identify the respective platforms and services. No endorsement or affiliation is implied.
            </p>
          </div>
        </div>
      </Card>

      {/* Legal Resources */}
      <Card className="gradient-border">
        <div className="gradient-border-inner p-6">
          <h2 className="text-xl font-bold text-white mb-4">Legal Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Copyright Information</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center space-x-2">
                  <ExternalLink size={14} />
                  <a href="https://www.copyright.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    U.S. Copyright Office
                  </a>
                </li>
                <li className="flex items-center space-x-2">
                  <ExternalLink size={14} />
                  <a href="https://www.copyright.gov/dmca/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    DMCA Information
                  </a>
                </li>
                <li className="flex items-center space-x-2">
                  <ExternalLink size={14} />
                  <a href="https://www.copyright.gov/help/faq/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    Copyright FAQ
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Platform Policies</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center space-x-2">
                  <ExternalLink size={14} />
                  <a href="https://www.google.com/dmca.html" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    Google™ DMCA Policy
                  </a>
                </li>
                <li className="flex items-center space-x-2">
                  <ExternalLink size={14} />
                  <a href="https://www.microsoft.com/en-us/legal/intellectualproperty/infringement" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    Microsoft DMCA Policy
                  </a>
                </li>
                <li className="flex items-center space-x-2">
                  <ExternalLink size={14} />
                  <a href="https://www.facebook.com/help/contact/1758255661104383" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    Facebook Copyright Help
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-electric-blue/10 border border-electric-blue/30 rounded-lg">
            <p className="text-electric-blue text-sm">
              <strong>Disclaimer:</strong> This information is provided for educational purposes only and does not constitute legal advice. 
              Consult with a qualified attorney for specific legal questions regarding copyright and intellectual property matters.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
