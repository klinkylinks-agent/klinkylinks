import { useState, useEffect } from "react";
import StatsCards from "@/components/dashboard/stats-cards";
import ViolationsPanel from "@/components/dashboard/violations-panel";
import QuickUpload from "@/components/dashboard/quick-upload";
import MonitoringStatus from "@/components/dashboard/monitoring-status";
import QuickActions from "@/components/dashboard/quick-actions";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddContent = () => {
    toast({
      title: "Upload Ready",
      description: "File upload interface is ready for your content.",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Report Generated",
      description: "Your comprehensive protection report is being prepared.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gradient">
                Content Protection Dashboard
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Advanced monitoring across Google™ Images, Google™ Videos, Bing® Images, and Bing® Videos
            </p>
          </div>
          <div className="flex space-x-4 mt-4 lg:mt-0">
            <Button 
              onClick={handleAddContent}
              className="btn-electric px-6 py-3 rounded-lg font-semibold neon-glow"
            >
              <Plus size={20} className="mr-2" />
              Add Content
            </Button>
            <Button 
              onClick={handleExportReport}
              className="btn-hot px-6 py-3 rounded-lg font-semibold"
            >
              <Download size={20} className="mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Violations Panel */}
        <div className="lg:col-span-2">
          <ViolationsPanel />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <QuickUpload />
          <MonitoringStatus />
          <QuickActions />
        </div>
      </div>

      {/* Bottom Section - Recent Activity */}
      <div className="mt-8">
        <div className="gradient-border">
          <div className="gradient-border-inner p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Recent Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Activity Items */}
              <ActivityItem
                icon="✅"
                title="DMCA Successful"
                time="2 hours ago"
                description="Content removed from unauthorized-site.com"
                color="neon-green"
              />
              <ActivityItem
                icon="⬆️"
                title="New Content Added"
                time="4 hours ago"
                description="3 new images uploaded for monitoring"
                color="electric-blue"
              />
              <ActivityItem
                icon="⚠️"
                title="Violation Detected"
                time="6 hours ago"
                description="Image found on competitor website"
                color="hot-pink"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  icon: string;
  title: string;
  time: string;
  description: string;
  color: string;
}

function ActivityItem({ icon, title, time, description, color }: ActivityItemProps) {
  return (
    <div className="bg-charcoal/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-8 h-8 bg-${color}/20 rounded-lg flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">{title}</h4>
          <p className="text-gray-400 text-xs">{time}</p>
        </div>
      </div>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
}
