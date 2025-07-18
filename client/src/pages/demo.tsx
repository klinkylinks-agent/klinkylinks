import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Upload, 
  Search, 
  AlertTriangle, 
  FileText, 
  Play,
  Eye,
  Clock,
  CheckCircle,
  Camera,
  Video,
  Image as ImageIcon,
  ArrowRight,
  X
} from "lucide-react";

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps = [
    {
      title: "Upload Your Content",
      description: "Drag and drop images or videos to start protecting them",
      icon: <Upload className="w-8 h-8 text-electric-blue" />,
      progress: 25,
      visual: (
        <div className="bg-gray-800/50 rounded-lg p-6 border-2 border-dashed border-purple-400/30">
          <div className="text-center">
            <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Drop files here</p>
            <p className="text-gray-400 text-sm">Supports JPG, PNG, MP4, MOV</p>
          </div>
        </div>
      )
    },
    {
      title: "AI Analysis & Fingerprinting",
      description: "Our AI creates unique digital fingerprints for your content",
      icon: <Eye className="w-8 h-8 text-hot-pink" />,
      progress: 50,
      visual: (
        <div className="bg-gray-800/50 rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium">my-artwork.jpg</h4>
              <p className="text-gray-400 text-sm">2.3 MB • Processed</p>
            </div>
            <CheckCircle className="w-6 h-6 text-neon-green" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Perceptual Hash</span>
              <span className="text-neon-green">Generated</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Content Analysis</span>
              <span className="text-neon-green">Complete</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Similarity Index</span>
              <span className="text-neon-green">Active</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Multi-Platform Monitoring",
      description: "Automated scanning across Google, Bing, and social platforms",
      icon: <Search className="w-8 h-8 text-neon-cyan" />,
      progress: 75,
      visual: (
        <div className="bg-gray-800/50 rounded-lg p-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Google Images", status: "Scanning", color: "text-electric-blue" },
              { name: "Google Videos", status: "Complete", color: "text-neon-green" },
              { name: "Bing Images", status: "Scanning", color: "text-electric-blue" },
              { name: "Bing Videos", status: "Queue", color: "text-yellow-500" }
            ].map((platform) => (
              <div key={platform.name} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <span className="text-white text-sm font-medium">{platform.name}</span>
                <Badge className={`${platform.color} bg-transparent text-xs`}>
                  {platform.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Violation Detection & DMCA",
      description: "Instant alerts and automated takedown notice generation",
      icon: <AlertTriangle className="w-8 h-8 text-neon-green" />,
      progress: 100,
      visual: (
        <div className="bg-gray-800/50 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <div>
                  <p className="text-white font-medium">Similarity Match Found</p>
                  <p className="text-gray-400 text-sm">google.com/search?q=...</p>
                </div>
              </div>
              <Badge className="bg-red-500/20 text-red-500">94% Match</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="text-white font-medium">DMCA Notice Generated</p>
                  <p className="text-gray-400 text-sm">Ready for review & sending</p>
                </div>
              </div>
              <Button size="sm" className="bg-neon-green/20 text-neon-green hover:bg-neon-green/30">
                Review
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-dark-gray">
      {/* Header */}
      <div className="bg-gradient-to-r from-electric-blue/10 to-hot-pink/10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                <span className="text-gradient">Platform Demo</span>
              </h1>
              <p className="text-gray-400 mt-2">
                Experience how KlinkyLinks protects your content in real-time
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/"}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Back to Home
              </Button>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isPlaying ? (
          /* Demo Introduction */
          <div className="text-center mb-12">
            <Card className="morphing-card p-12 max-w-4xl mx-auto">
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  See KlinkyLinks in Action
                </h2>
                <p className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto">
                  Watch how our AI-powered platform detects content violations and generates DMCA takedown notices automatically
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-electric-blue" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Image Protection</h3>
                    <p className="text-gray-400 text-sm">Monitor images across search engines</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-hot-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="w-8 h-8 text-hot-pink" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Video Monitoring</h3>
                    <p className="text-gray-400 text-sm">Detect video violations automatically</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-neon-green" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">DMCA Automation</h3>
                    <p className="text-gray-400 text-sm">Generate legal notices instantly</p>
                  </div>
                </div>
                <Button 
                  onClick={startDemo}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:via-pink-600 hover:to-purple-700 text-xl px-12 py-6 rounded-3xl font-bold"
                >
                  Start Interactive Demo
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          /* Interactive Demo */
          <div className="space-y-8">
            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Step {currentStep + 1} of {demoSteps.length}
                </h3>
                <div className="text-sm text-gray-400">
                  {Math.round(demoSteps[currentStep].progress)}% Complete
                </div>
              </div>
              <Progress value={demoSteps[currentStep].progress} className="h-2" />
            </div>

            {/* Current Step */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Step Info */}
              <Card className="gradient-border">
                <div className="gradient-border-inner p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    {demoSteps[currentStep].icon}
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {demoSteps[currentStep].title}
                      </h2>
                      <p className="text-gray-400 mt-2">
                        {demoSteps[currentStep].description}
                      </p>
                    </div>
                  </div>

                  {/* Step-specific content */}
                  <div className="space-y-4">
                    {currentStep === 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                          <span className="text-gray-300">Drag & drop interface</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                          <span className="text-gray-300">Multi-format support</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                          <span className="text-gray-300">Instant processing</span>
                        </div>
                      </div>
                    )}
                    {currentStep === 1 && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                          <span className="text-gray-300">AI-powered analysis</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                          <span className="text-gray-300">Perceptual fingerprinting</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                          <span className="text-gray-300">Content metadata extraction</span>
                        </div>
                      </div>
                    )}
                    {currentStep === 2 && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                          <span className="text-gray-300">24/7 monitoring</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                          <span className="text-gray-300">Multiple search engines</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                          <span className="text-gray-300">Intelligent scheduling</span>
                        </div>
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                          <span className="text-gray-300">Instant violation alerts</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                          <span className="text-gray-300">Automated DMCA generation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-neon-green" />
                          <span className="text-gray-300">Legal compliance</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Visual Demo */}
              <Card className="gradient-border">
                <div className="gradient-border-inner p-8">
                  {demoSteps[currentStep].visual}
                </div>
              </Card>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Button 
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Previous
              </Button>
              
              <div className="flex space-x-2">
                {demoSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep ? 'bg-electric-blue' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {currentStep < demoSteps.length - 1 ? (
                <Button 
                  onClick={nextStep}
                  className="bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:via-pink-600 hover:to-purple-700 font-bold"
                >
                  Sign Up Now
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}