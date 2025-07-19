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
  Mail, 
  Calendar, 
  CreditCard, 
  Shield,
  MoreHorizontal 
} from "lucide-react";

export default function AdminUsers() {
  const { user, isLoading } = useAuth();
  const { isAdmin } = useRole();
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

  const { data: users } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!user && isAdmin,
  });

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-dark-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading user management...</p>
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
                <span className="text-gradient">User Management</span>
              </h1>
              <p className="text-gray-400 mt-2">
                Manage platform users and subscriptions
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/admin"}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Back to Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2" />
              All Users ({users?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users?.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-electric-blue" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={`${
                      user.subscriptionStatus === 'active' 
                        ? 'bg-neon-green/20 text-neon-green' 
                        : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {user.subscriptionStatus || 'Free'}
                    </Badge>
                    <Badge className={`${
                      user.role === 'admin' 
                        ? 'bg-red-500/20 text-red-500' 
                        : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {user.role || 'User'}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!users || users.length === 0) && (
                <div className="text-center py-8 text-gray-400">
                  No users found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}