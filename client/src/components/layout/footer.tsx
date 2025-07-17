import { Link } from "wouter";
import { Shield, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Legal Links */}
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/legal" className="text-gray-400 hover:text-white transition-colors text-sm">
              DMCA Policy
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
              Contact Support
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Shield className="text-neon-green" size={16} />
              <span>Secured by Stripe®</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Lock className="text-electric-blue" size={16} />
              <span>SSL Protected</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 pt-6 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            © 2024 KlinkyLinks. All rights reserved. Protecting creators with advanced AI-powered content monitoring.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Google™ and Bing® are trademarks of Google LLC and Microsoft Corporation respectively.
          </p>
        </div>
      </div>
    </footer>
  );
}
