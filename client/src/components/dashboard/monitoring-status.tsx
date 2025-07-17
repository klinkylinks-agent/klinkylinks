import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Pause } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'error';
  lastScan: string;
}

const platforms: Platform[] = [
  {
    id: 'google_images',
    name: 'Google™ Images',
    status: 'active',
    lastScan: '2 minutes ago'
  },
  {
    id: 'google_videos', 
    name: 'Google™ Videos',
    status: 'active',
    lastScan: '5 minutes ago'
  },
  {
    id: 'bing_images',
    name: 'Bing® Images', 
    status: 'active',
    lastScan: '3 minutes ago'
  },
  {
    id: 'bing_videos',
    name: 'Bing® Videos',
    status: 'active', 
    lastScan: '7 minutes ago'
  }
];

export default function MonitoringStatus() {
  const [platformStatus] = useState<Platform[]>(platforms);

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="text-neon-green text-sm font-semibold">Active</span>;
      case 'paused':
        return <span className="text-yellow-500 text-sm font-semibold">Paused</span>;
      case 'error':
        return <span className="text-hot-pink text-sm font-semibold">Error</span>;
      default:
        return <span className="text-gray-400 text-sm font-semibold">Unknown</span>;
    }
  };

  const allActive = platformStatus.every(p => p.status === 'active');

  return (
    <Card className="gradient-border">
      <div className="gradient-border-inner p-6">
        <h3 className="text-xl font-bold mb-4 text-white">Monitoring Status</h3>
        <div className="space-y-4">
          {platformStatus.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(platform.status)}
                <span className="text-gray-300 text-sm">{platform.name}</span>
              </div>
              {getStatusText(platform.status)}
            </div>
          ))}
        </div>
        
        {/* Overall Status */}
        <div className={`mt-4 p-3 rounded-lg border ${
          allActive 
            ? 'bg-neon-green/10 border-neon-green/30' 
            : 'bg-yellow-500/10 border-yellow-500/30'
        }`}>
          <p className={`font-semibold text-sm flex items-center ${
            allActive ? 'text-neon-green' : 'text-yellow-500'
          }`}>
            {allActive ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                All systems operational
              </>
            ) : (
              <>
                <AlertTriangle size={16} className="mr-2" />
                Some systems need attention
              </>
            )}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Last scan: {Math.min(...platformStatus.map(p => 
              parseInt(p.lastScan.split(' ')[0]) || 0
            ))} minutes ago
          </p>
        </div>
      </div>
    </Card>
  );
}
