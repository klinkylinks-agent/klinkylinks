import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Shield, AlertTriangle, Gavel, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";

interface StatCardProps {
  title: string;
  value: number;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, changeType, icon, color }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayValue(prev => {
        if (prev < value) {
          return Math.min(prev + Math.ceil(value / 50), value);
        }
        return value;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [value]);

  const changeIcon = changeType === "increase" ? TrendingUp : TrendingDown;
  const ChangeIcon = changeIcon;

  return (
    <div className="gradient-border">
      <div className="gradient-border-inner p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className={`text-3xl font-bold text-${color} mb-1`}>
              {displayValue.toLocaleString()}
            </p>
            <p className={`text-${color} text-sm flex items-center`}>
              <ChangeIcon size={16} className="mr-1" />
              {change}
            </p>
          </div>
          <div className={`w-12 h-12 bg-${color}/20 rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatsCards() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error)) return false;
      return failureCount < 3;
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 1000);
      }
    },
  });

  if (isLoading || !user) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="gradient-border animate-pulse">
            <div className="gradient-border-inner p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-full">
          <div className="gradient-border">
            <div className="gradient-border-inner p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-500">Failed to load dashboard statistics</p>
              <p className="text-gray-400 text-sm mt-1">Please check your connection and try again</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statsData = stats || {
    totalContent: 0,
    totalViolations: 0,
    dmcaSent: 0,
    successRate: 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Protected Content"
        value={statsData.totalContent}
        change="+12% this month"
        changeType="increase"
        icon={<Shield className="text-neon-green text-xl" />}
        color="neon-green"
      />
      
      <StatCard
        title="Violations Detected"
        value={statsData.totalViolations}
        change="3 new today"
        changeType="increase"
        icon={<AlertTriangle className="text-hot-pink text-xl" />}
        color="hot-pink"
      />
      
      <StatCard
        title="DMCA Sent"
        value={statsData.dmcaSent}
        change="5 pending approval"
        changeType="neutral"
        icon={<Gavel className="text-electric-blue text-xl" />}
        color="electric-blue"
      />
      
      <StatCard
        title="Success Rate"
        value={statsData.successRate}
        change="Content removed"
        changeType="increase"
        icon={<CheckCircle className="text-neon-cyan text-xl" />}
        color="neon-cyan"
      />
    </div>
  );
}
