import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViolationThumbnail } from "@/components/ui/violation-thumbnail";
import { useViolations } from "@/hooks/use-dashboard-data";
import { 
  Filter, 
  Search, 
  Eye, 
  Gavel, 
  MoreHorizontal,
  ExternalLink,
  ArrowRight 
} from "lucide-react";

interface Violation {
  id: number;
  title: string;
  url: string;
  platform: string;
  priority: 'low' | 'medium' | 'high';
  status: 'detected' | 'dmca_pending' | 'dmca_sent' | 'resolved';
  thumbnailUrl: string;
  detectedAt: string;
}

const mockViolations: Violation[] = [
  {
    id: 1,
    title: "Unauthorized use on social platform",
    url: "instagram.com/unauthorized_page",
    platform: "Google™ Images",
    priority: "high",
    status: "detected",
    thumbnailUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=32&h=32&fit=crop",
    detectedAt: "2 hours ago"
  },
  {
    id: 2,
    title: "Video content copied to competitor site",
    url: "competitor-site.com/stolen-video",
    platform: "Bing® Videos",
    priority: "medium",
    status: "detected",
    thumbnailUrl: "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=32&h=32&fit=crop",
    detectedAt: "4 hours ago"
  },
  {
    id: 3,
    title: "Image used without permission in blog",
    url: "random-blog.net/my-stolen-image",
    platform: "Google™ Videos",
    priority: "low",
    status: "dmca_sent",
    thumbnailUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=32&h=32&fit=crop",
    detectedAt: "6 hours ago"
  }
];

export default function ViolationsPanel() {
  const [violations] = useState<Violation[]>(mockViolations);
  const [filter, setFilter] = useState<string>('all');

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-hot-pink/20 text-hot-pink">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-500">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-neon-green/20 text-neon-green">Low Priority</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusButton = (violation: Violation) => {
    if (violation.status === 'dmca_sent') {
      return (
        <Button size="sm" className="bg-neon-green text-black hover:bg-neon-green/80 font-semibold">
          <Gavel size={14} className="mr-1" />
          DMCA Sent
        </Button>
      );
    }
    return (
      <Button size="sm" className="bg-electric-blue text-white hover:bg-electric-blue/80">
        <Gavel size={14} className="mr-1" />
        Send DMCA
      </Button>
    );
  };

  return (
    <Card className="gradient-border h-full">
      <div className="gradient-border-inner p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Violations</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-gray-400 hover:text-white border-gray-600">
              <Filter size={16} className="mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="text-gray-400 hover:text-white border-gray-600">
              <Search size={16} className="mr-1" />
              Search
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {violations.map((violation) => (
            <div
              key={violation.id}
              className="bg-charcoal/50 border border-gray-700 rounded-lg p-4 hover:border-hot-pink/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <ViolationThumbnail
                    src={violation.thumbnailUrl}
                    alt="Violation screenshot"
                    className="violation-thumbnail border border-gray-600"
                  />
                  <div>
                    <h3 className="font-semibold text-white text-sm">{violation.title}</h3>
                    <p className="text-gray-400 text-xs">Found on: {violation.url}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getPriorityBadge(violation.priority)}
                      <span className="text-gray-500 text-xs">{violation.platform}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusButton(violation)}
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Eye size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center pt-4">
          <Button variant="ghost" className="text-electric-blue hover:text-neon-cyan transition-colors font-semibold text-sm">
            View All Violations 
            <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
