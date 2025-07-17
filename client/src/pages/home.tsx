import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Upload, Bell, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  const { data: recentViolations, isLoading: violationsLoading } = useQuery({
    queryKey: ["/api/dashboard/recent-violations"],
    enabled: !!user,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white relative overflow-hidden">
      {/* Dynamic morphing background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/15 blur-3xl floating" style={{animation: 'morphBubble 15s ease-in-out infinite'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/15 to-cyan-500/10 blur-3xl floating-delayed" style={{animation: 'morphBubble 12s ease-in-out infinite reverse'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-500/15 to-purple-500/10 blur-3xl floating" style={{animation: 'morphBubble 18s ease-in-out infinite'}}></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-slate-900/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Shield className="w-9 h-9 text-purple-400 group-hover:text-pink-400 transition-colors duration-300" />
                <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h1 className="text-3xl font-bold gradient-text">
                KlinkyLinks
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="morphing-card px-6 py-3 flex items-center space-x-3">
                {user.profileImageUrl && (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-400/50"
                  />
                )}
                <span className="text-gray-200 font-medium">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                size="sm"
                className="border-purple-400/30 text-purple-300 hover:border-purple-400 hover:bg-purple-400/10 transition-all duration-300 rounded-2xl px-4 py-2"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl font-black mb-6 gradient-text">
            Welcome back, {user.firstName || 'Creator'}!
          </h2>
          <p className="text-gray-200 text-xl font-light leading-relaxed">
            Monitor your content protection and manage DMCA takedowns from your dashboard.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-6"></div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Link href="/upload">
            <div className="morphing-card group p-8 cursor-pointer floating" style={{animationDelay: '0ms'}}>
              <div className="relative z-10 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <Upload className="w-12 h-12 text-blue-400 group-hover:text-cyan-400 group-hover:scale-125 transition-all duration-500" />
                    <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all duration-500">
                  Upload Content
                </h3>
                <p className="text-gray-300 font-light leading-relaxed">
                  Add new content to monitor for infringements
                </p>
                <div className="mt-4 px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300 inline-block">
                  Quick Action
                </div>
              </div>
            </div>
          </Link>

          <Link href="/monitoring">
            <div className="morphing-card group p-8 cursor-pointer floating" style={{animationDelay: '200ms'}}>
              <div className="relative z-10 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <Bell className="w-12 h-12 text-yellow-400 group-hover:text-orange-400 group-hover:scale-125 transition-all duration-500" />
                    <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all duration-500">
                  Run Scan
                </h3>
                <p className="text-gray-300 font-light leading-relaxed">
                  Start manual monitoring for all your content
                </p>
                <div className="mt-4 px-3 py-1 bg-yellow-500/20 rounded-full text-xs text-yellow-300 inline-block">
                  Monitor
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dmca">
            <div className="morphing-card group p-8 cursor-pointer floating" style={{animationDelay: '400ms'}}>
              <div className="relative z-10 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <Shield className="w-12 h-12 text-green-400 group-hover:text-emerald-400 group-hover:scale-125 transition-all duration-500" />
                    <div className="absolute inset-0 bg-green-400/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all duration-500">
                  DMCA Center
                </h3>
                <p className="text-gray-300 font-light leading-relaxed">
                  Manage takedown notices and legal actions
                </p>
                <div className="mt-4 px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-300 inline-block">
                  Legal
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Dashboard */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="morphing-card group p-6 text-center floating" style={{animationDelay: '0ms'}}>
            <div className="relative z-10">
              <h4 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Protected Content</h4>
              <div className="text-5xl font-black mb-3 text-blue-400 group-hover:gradient-text transition-all duration-500">
                {statsLoading ? (
                  <div className="animate-pulse bg-slate-700 h-12 w-20 rounded-xl mx-auto"></div>
                ) : stats?.totalContent || 0}
              </div>
              <p className="text-gray-500 font-light">Active items</p>
            </div>
          </div>

          <div className="morphing-card group p-6 text-center floating" style={{animationDelay: '100ms'}}>
            <div className="relative z-10">
              <h4 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Violations Detected</h4>
              <div className="text-5xl font-black mb-3 text-red-400 group-hover:gradient-text transition-all duration-500">
                {statsLoading ? (
                  <div className="animate-pulse bg-slate-700 h-12 w-20 rounded-xl mx-auto"></div>
                ) : stats?.totalViolations || 0}
              </div>
              <p className="text-gray-500 font-light">Total found</p>
            </div>
          </div>

          <div className="morphing-card group p-6 text-center floating" style={{animationDelay: '200ms'}}>
            <div className="relative z-10">
              <h4 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">DMCA Sent</h4>
              <div className="text-5xl font-black mb-3 text-yellow-400 group-hover:gradient-text transition-all duration-500">
                {statsLoading ? (
                  <div className="animate-pulse bg-slate-700 h-12 w-20 rounded-xl mx-auto"></div>
                ) : stats?.dmcaSent || 0}
              </div>
              <p className="text-gray-500 font-light">Takedown notices</p>
            </div>
          </div>

          <div className="morphing-card group p-6 text-center floating" style={{animationDelay: '300ms'}}>
            <div className="relative z-10">
              <h4 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Success Rate</h4>
              <div className="text-5xl font-black mb-3 text-green-400 group-hover:gradient-text transition-all duration-500">
                {statsLoading ? (
                  <div className="animate-pulse bg-slate-700 h-12 w-20 rounded-xl mx-auto"></div>
                ) : `${stats?.successRate || 0}%`}
              </div>
              <p className="text-gray-500 font-light">Resolution rate</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="morphing-card p-8 floating">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-lg"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold gradient-text">
                  Recent Violations
                </h3>
                <p className="text-gray-300 font-light">
                  Latest copyright infringements detected across the web
                </p>
              </div>
            </div>
            {violationsLoading ? (
              <div className="text-center py-12">
                <div className="relative">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md"></div>
                </div>
                <p className="text-gray-400 mt-4 text-lg">Loading violations...</p>
              </div>
            ) : !recentViolations || recentViolations.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative mb-6">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                  <div className="absolute inset-0 bg-green-400/20 rounded-full blur-lg"></div>
                </div>
                <p className="text-gray-300 text-lg mb-2">No violations detected yet</p>
                <p className="text-sm text-gray-500">Upload content to start monitoring</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentViolations.slice(0, 5).map((violation: any, index: number) => (
                  <div 
                    key={violation.id} 
                    className="group flex items-center justify-between p-5 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <AlertTriangle className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div>
                        <p className="font-medium text-white group-hover:text-yellow-300 transition-colors duration-300">
                          {violation.title}
                        </p>
                        <p className="text-sm text-gray-400 capitalize">{violation.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-400 mb-1">
                        {Math.round(parseFloat(violation.similarity || "0") * 100)}% match
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(violation.detectedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentViolations.length > 5 && (
                  <div className="text-center pt-6">
                    <Link href="/dashboard">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-400/50 text-blue-300 hover:bg-blue-400/10 hover:border-blue-400 transition-all duration-300"
                      >
                        View All Violations
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}