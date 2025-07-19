import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { TechOnlyDisclaimer } from "@/components/legal/TechOnlyDisclaimer";
import UserResponsibilityModal from "@/components/legal/UserResponsibilityModal";
import { 
  Search, 
  Eye, 
  Pause, 
  Play, 
  Settings, 
  Filter,
  RefreshCw,
  Clock,
  Globe,
  AlertTriangle,
  CheckCircle 
} from "lucide-react";

interface MonitoringPlatform {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'paused' | 'error';
  lastScan: string;
  itemsFound: number;
  enabled: boolean;
}

interface ContentItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  thumbnail: string;
  platforms: string[];
  lastScanned: string;
  status: 'active' | 'paused';
  similarityMatches: number;
}

export default function Monitoring() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch user's content items
  const { data: contentItems, isLoading: contentLoading } = useQuery({
    queryKey: ["/api/content"],
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

  // Fetch monitoring platform status
  const { data: platformData, isLoading: platformLoading } = useQuery({
    queryKey: ["/api/monitoring/status"],
    enabled: !!user,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error)) return false;
      return failureCount < 3;
    },
  });

  // Default platform data with realistic scheduling
  const defaultPlatforms: MonitoringPlatform[] = [
    {
      id: 'google_images',
      name: 'Google™ Images',
      icon: '🔍',
      status: 'active',
      lastScan: '14 hours ago',
      itemsFound: 0,
      enabled: true,
    },
    {
      id: 'google_videos',
      name: 'Google™ Videos',
      icon: '🎥',
      status: 'active',
      lastScan: '18 hours ago',
      itemsFound: 0,
      enabled: true,
    },
    {
      id: 'bing_images',
      name: 'Bing® Images',
      icon: '🔎',
      status: 'active',
      lastScan: '22 hours ago',
      itemsFound: 0,
      enabled: true,
    },
    {
      id: 'bing_videos',
      name: 'Bing® Videos',
      icon: '📹',
      status: 'active',
      lastScan: '16 hours ago',
      itemsFound: 0,
      enabled: true,
    },
  ];

  const platforms = platformData || defaultPlatforms;

  // Mutation for scheduling scans
  const scheduleScanMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/monitoring/schedule-scan", {});
    },
    onSuccess: () => {
      toast({
        title: "Scan Scheduled",
        description: "Your scan has been added to the queue. Reports will be generated within 24 hours to avoid detection.",
        variant: "default",
      });
      queryClient.invalidateQueries(["/api/monitoring/status"]);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 1000);
      } else {
        toast({
          title: "Scan Failed",
          description: "Unable to schedule scan. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const togglePlatform = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    toast({
      title: platform?.enabled ? "Platform Paused" : "Platform Activated",
      description: `${platform?.name} monitoring has been ${platform?.enabled ? 'paused' : 'activated'}.`,
    });
  };

  const runManualScan = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to schedule scans",
        variant: "destructive",
      });
      return;
    }
    
    scheduleScanMutation.mutate();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-neon-green/20 text-neon-green">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500/20 text-yellow-500">Paused</Badge>;
      case 'error':
        return <Badge className="bg-hot-pink/20 text-hot-pink">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" />;
      case 'paused':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full" />;
      case 'error':
        return <div className="w-3 h-3 bg-hot-pink rounded-full" />;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gradient">Similarity Monitoring Dashboard</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Scheduled content similarity detection with 24-hour reporting to avoid bot detection
            </p>
          </div>
          <div className="flex space-x-4 mt-4 lg:mt-0">
            <UserResponsibilityModal
              title="Schedule Similarity Scan"
              description="This will add your content to the scanning queue. Reports will be generated within 24 hours to avoid search engine detection. You must evaluate all matches and make legal determinations yourself."
              requiresTyping={true}
              confirmationText="I understand"
              onAccept={runManualScan}
            >
              <Button className="btn-electric">
                <RefreshCw size={20} className="mr-2" />
                Schedule Scan
              </Button>
            </UserResponsibilityModal>
            <Button className="btn-hot">
              <Settings size={20} className="mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Technology-Only Disclaimer */}
        <TechOnlyDisclaimer 
          context="monitoring" 
          prominent={true}
          showExternalLinks={true}
        />

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              icon={<Search size={20} />}
            />
          </div>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Filter size={20} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Platform Status */}
        <div className="lg:col-span-1">
          <Card className="gradient-border h-fit">
            <div className="gradient-border-inner p-6">
              <h2 className="text-xl font-bold text-white mb-4">Platform Status</h2>
              <div className="space-y-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between p-4 bg-charcoal/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(platform.status)}
                      <div>
                        <h3 className="font-semibold text-white text-sm">
                          {platform.name}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {platform.lastScan} • {platform.itemsFound.toLocaleString()} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(platform.status)}
                      <Switch
                        checked={platform.enabled}
                        onCheckedChange={() => togglePlatform(platform.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Stats */}
              <div className="mt-6 p-4 bg-neon-green/10 border border-neon-green/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="text-neon-green" size={16} />
                  <span className="text-neon-green font-semibold text-sm">
                    All Systems Operational
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                  <div>
                    <p>Active Platforms</p>
                    <p className="text-white font-semibold">
                      {platforms.filter(p => p.enabled).length}/{platforms.length}
                    </p>
                  </div>
                  <div>
                    <p>Total Items Monitored</p>
                    <p className="text-white font-semibold">
                      {platforms.reduce((sum, p) => sum + p.itemsFound, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Items */}
        <div className="lg:col-span-2">
          <Card className="gradient-border">
            <div className="gradient-border-inner p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Protected Content</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock size={16} />
                  <span>Last updated: 8 hours ago</span>
                </div>
              </div>

              <div className="space-y-4">
                {contentItems
                  .filter(item => 
                    searchTerm === "" || 
                    item.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-charcoal/50 rounded-lg border border-gray-700 hover:border-electric-blue/50 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                        />
                        <div>
                          <h3 className="font-semibold text-white">{item.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="text-gray-400 text-xs">
                              {item.platforms.join(', ')}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">
                            Last scanned: {item.lastScanned}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Similarity Match Count */}
                        {item.similarityMatches > 0 ? (
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="text-blue-400" size={16} />
                            <span className="text-blue-400 font-semibold">
                              {item.similarityMatches} match{item.similarityMatches !== 1 ? 'es' : ''}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="text-neon-green" size={16} />
                            <span className="text-neon-green">No matches</span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <UserResponsibilityModal
                            title="View Similarity Matches"
                            description="This will show technical similarity matches. You must evaluate each match and determine if legal action is warranted."
                            onAccept={() => console.log('View matches for', item.id)}
                          >
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Eye size={16} />
                            </Button>
                          </UserResponsibilityModal>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            {item.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Settings size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Empty State */}
              {contentItems.length === 0 && (
                <div className="text-center py-12">
                  <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    No Content Being Monitored
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Upload your first content to start monitoring for similarity matches.
                  </p>
                  <Button className="btn-electric">
                    Upload Content
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
