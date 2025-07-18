import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  FileText, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  Database,
  Activity,
  Server 
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const { isAdmin, isSuperAdmin } = useRole();
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [user, isLoading, isAdmin, toast]);

  const { data: adminStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!user && isAdmin,
  });

  const { data: platformHealth } = useQuery({
    queryKey: ["/api/admin/platform-health"],
    enabled: !!user && isAdmin,
  });

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-dark-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-gray">
      {/* Header */}
      <div className="bg-gradient-to-r from-electric-blue/10 to-hot-pink/10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                <span className="text-gradient">Admin Control Center</span>
              </h1>
              <p className="text-gray-400 mt-2">
                Platform administration and monitoring
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-electric-blue/20 text-electric-blue">
                {isSuperAdmin ? "Super Admin" : "Admin"}
              </Badge>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/"}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Back to Platform
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-electric-blue">
                {adminStats?.totalUsers || 0}
              </div>
              <p className="text-xs text-gray-500">
                +{adminStats?.newUsersToday || 0} today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Content Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hot-pink">
                {adminStats?.totalContent || 0}
              </div>
              <p className="text-xs text-gray-500">
                +{adminStats?.newContentToday || 0} today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                DMCA Notices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-green">
                {adminStats?.totalDmca || 0}
              </div>
              <p className="text-xs text-gray-500">
                +{adminStats?.newDmcaToday || 0} today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                ${adminStats?.monthlyRevenue || 0}
              </div>
              <p className="text-xs text-gray-500">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Health */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-green mb-1">
                  {platformHealth?.uptime || "99.9%"}
                </div>
                <p className="text-sm text-gray-400">System Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-electric-blue mb-1">
                  {platformHealth?.responseTime || "150ms"}
                </div>
                <p className="text-sm text-gray-400">Avg Response Time</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-hot-pink mb-1">
                  {platformHealth?.activeScans || "24"}
                </div>
                <p className="text-sm text-gray-400">Active Scans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30">
                View All Users
              </Button>
              <Button className="w-full bg-hot-pink/20 text-hot-pink hover:bg-hot-pink/30">
                Manage Subscriptions
              </Button>
              <Button className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                Send Notifications
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">System Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-neon-green/20 text-neon-green hover:bg-neon-green/30">
                <Database className="w-4 h-4 mr-2" />
                Database Management
              </Button>
              <Button className="w-full bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">
                <Server className="w-4 h-4 mr-2" />
                System Logs
              </Button>
              {isSuperAdmin && (
                <Button className="w-full bg-red-500/20 text-red-500 hover:bg-red-500/30">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Emergency Controls
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}