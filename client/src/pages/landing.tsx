import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Search, Zap, CheckCircle, Users, Globe } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-500" />,
      title: "AI-Powered Monitoring",
      description: "Advanced algorithms scan the web 24/7 to detect unauthorized use of your content across multiple platforms."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Automated DMCA Generation",
      description: "Legal-compliant takedown notices generated instantly using GPT-4, saving hours of manual work."
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: "Lightning Fast Detection",
      description: "Perceptual fingerprinting technology identifies infringements within minutes of discovery."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-blue-500" />,
      title: "Human-in-the-Loop Approval",
      description: "Review and approve DMCA notices before sending to ensure accuracy and maintain control."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Creator-First Design",
      description: "Built specifically for content creators who need powerful protection without complexity."
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      title: "Multi-Platform Coverage",
      description: "Monitor Google Images, Bing, social media, and other platforms from a single dashboard."
    }
  ];

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Dynamic morphing background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/20 blur-3xl floating" style={{animation: 'morphBubble 15s ease-in-out infinite'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/25 to-cyan-500/15 blur-3xl floating-delayed" style={{animation: 'morphBubble 12s ease-in-out infinite reverse'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-500/20 to-purple-500/10 blur-3xl floating" style={{animation: 'morphBubble 18s ease-in-out infinite'}}></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/15 to-blue-500/20 blur-3xl floating-delayed" style={{animation: 'morphBubble 20s ease-in-out infinite reverse'}}></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="morphing-card px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Shield className="w-9 h-9 text-purple-400 group-hover:text-pink-400 transition-colors duration-300" />
                <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold gradient-text">
                KlinkyLinks
              </span>
            </div>
            <Button 
              onClick={handleLogin} 
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:via-pink-600 hover:to-purple-700 shadow-lg hover:shadow-purple-500/30 transition-all duration-500 rounded-2xl px-6 py-3 text-white font-semibold"
            >
              Sign In
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
              <span className="gradient-text block mb-2">
                Protect Your 
              </span>
              <span className="gradient-text block mb-2 text-7xl md:text-9xl">
                Content
              </span>
              <span className="gradient-text block">
                Automatically
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="relative mb-12">
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
              The ultimate content protection platform for creators. AI-powered monitoring, 
              automated DMCA takedowns, and real-time infringement detection across the web.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="group relative bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:via-pink-600 hover:to-purple-700 text-lg px-12 py-6 rounded-3xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 font-bold"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/50 via-pink-400/50 to-purple-400/50 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="morphing-card border-2 border-purple-400/30 text-purple-300 hover:text-pink-300 text-lg px-12 py-6 rounded-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 font-semibold"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black mb-6 gradient-text">
            Everything You Need to Protect Your Work
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Comprehensive content protection powered by cutting-edge AI and legal automation
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full mt-6"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="morphing-card group p-8 floating" style={{animationDelay: `${index * 200}ms`}}>
              <div className="relative z-10">
                <div className="mb-8 transform group-hover:scale-125 transition-all duration-500 flex justify-center">
                  <div className="relative">
                    {feature.icon}
                    <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-purple-400/50 to-pink-400/50 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-white text-2xl font-bold mb-4 group-hover:gradient-text transition-all duration-500 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-center font-light">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="morphing-card p-16 text-center floating">
          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-black mb-8 gradient-text">
              Ready to Protect Your Content?
            </h2>
            <p className="text-gray-200 text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Join thousands of creators who trust KlinkyLinks to safeguard their intellectual property
            </p>
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="group relative bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:via-pink-600 hover:to-purple-700 text-xl px-16 py-8 rounded-3xl shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 transform hover:-translate-y-3 hover:scale-110 mb-8 font-bold"
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/60 via-pink-400/60 to-purple-400/60 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
            <p className="text-gray-400 text-lg font-light">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-slate-700">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="text-white font-semibold">KlinkyLinks</span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 KlinkyLinks. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}