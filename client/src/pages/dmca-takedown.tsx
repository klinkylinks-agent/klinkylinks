import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Clock, CheckCircle, AlertTriangle, Search } from "lucide-react";
import { useLocation } from "wouter";

export default function DMCATakedown() {
  const [, navigate] = useLocation();

  const steps = [
    {
      icon: <Search className="w-8 h-8 text-blue-500" />,
      title: "Content Detection",
      description: "Our AI monitors Google Images, Google Videos, Bing Images, and Bing Videos 24/7 to detect unauthorized use of your copyrighted content."
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
      title: "Infringement Analysis",
      description: "Advanced perceptual matching algorithms analyze suspected copyright infringement with similarity scoring and evidence collection."
    },
    {
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      title: "DMCA Notice Generation",
      description: "Professional DMCA takedown notices automatically generated using AI, compliant with Digital Millennium Copyright Act requirements."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: "Takedown Submission",
      description: "Legal notices sent to search engines and hosting platforms for copyright infringement removal and content protection."
    }
  ];

  const faqs = [
    {
      question: "What is a DMCA takedown notice?",
      answer: "A DMCA takedown notice is a legal document used to request removal of copyrighted content from websites and search engines under the Digital Millennium Copyright Act."
    },
    {
      question: "How long does DMCA takedown take?",
      answer: "Most platforms respond to DMCA takedown requests within 10-14 business days. Search engines like Google typically process requests within 24-72 hours."
    },
    {
      question: "What content can I protect with DMCA?",
      answer: "Any original copyrighted content including images, videos, text, music, and other creative works that you own or have rights to protect."
    },
    {
      question: "Is automated DMCA monitoring legal?",
      answer: "Yes, automated monitoring and DMCA notice generation is completely legal when used to protect legitimate copyrighted content you own."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="morphing-card px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-9 h-9 text-purple-400" />
              <span className="text-2xl font-bold gradient-text">KlinkyLinks</span>
            </div>
            <Button 
              onClick={() => navigate("/auth")} 
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:via-pink-600 hover:to-purple-700"
            >
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-8 gradient-text">
            Professional DMCA Takedown Service
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
            Automated copyright protection with AI-powered DMCA takedown notice generation. 
            Protect your images and videos from infringement across Google, Bing, and social media.
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            size="lg" 
            className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-lg px-12 py-6 rounded-3xl"
          >
            Start Protection Now
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-8 gradient-text">
            How DMCA Takedown Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our automated DMCA takedown service protects your content through a comprehensive 4-step process
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="morphing-card p-6">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">{step.icon}</div>
                <CardTitle className="text-xl font-bold gradient-text">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* DMCA Takedown Benefits */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 gradient-text">
              Why Choose Professional DMCA Service?
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Legal Compliance</h3>
                  <p className="text-gray-300">DMCA notices generated according to Digital Millennium Copyright Act requirements</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">24/7 Monitoring</h3>
                  <p className="text-gray-300">Continuous scanning across Google, Bing, and social media for copyright infringement</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FileText className="w-6 h-6 text-purple-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Automated Generation</h3>
                  <p className="text-gray-300">AI-powered DMCA takedown notices created and submitted automatically</p>
                </div>
              </div>
            </div>
          </div>
          <div className="morphing-card p-8">
            <h3 className="text-2xl font-bold gradient-text mb-6">DMCA Takedown Features</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Google Images & Videos monitoring</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Bing Images & Videos protection</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Social media copyright protection</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>AI-powered similarity detection</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Professional DMCA notice templates</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Evidence collection & documentation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-8 gradient-text">
            DMCA Takedown FAQ
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Common questions about DMCA takedown notices and copyright protection
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {faqs.map((faq, index) => (
            <Card key={index} className="morphing-card p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {faq.answer}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="morphing-card max-w-4xl mx-auto p-12">
          <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">
            Start Your DMCA Protection Today
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of creators protecting their content with professional DMCA takedown services
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            size="lg" 
            className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-lg px-12 py-6 rounded-3xl"
          >
            Get Started - $29.99/month
          </Button>
        </div>
      </section>
    </div>
  );
}