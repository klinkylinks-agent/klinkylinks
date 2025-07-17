import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, Gavel, Download, Plus, Settings } from "lucide-react";

export default function QuickActions() {
  const { toast } = useToast();

  const handleManualScan = () => {
    toast({
      title: "Manual Scan Started",
      description: "Scanning all platforms for new violations. This may take a few minutes.",
    });
  };

  const handleReviewDMCA = () => {
    toast({
      title: "DMCA Review",
      description: "Opening pending DMCA notices for review.",
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report Generated",
      description: "Your protection report is being prepared for download.",
    });
  };

  const handleAddContent = () => {
    toast({
      title: "Upload Ready",
      description: "Redirecting to content upload page...",
    });
  };

  const handleSettings = () => {
    toast({
      title: "Settings",
      description: "Opening monitoring configuration...",
    });
  };

  return (
    <Card className="gradient-border">
      <div className="gradient-border-inner p-6">
        <h3 className="text-xl font-bold mb-4 text-white">Quick Actions</h3>
        <div className="space-y-3">
          <Button 
            onClick={handleManualScan}
            className="w-full bg-gradient-to-r from-electric-blue to-neon-cyan text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-electric-blue/30 transition-all"
          >
            <Search size={16} className="mr-2" />
            Run Manual Scan
          </Button>
          
          <Button 
            onClick={handleReviewDMCA}
            className="w-full bg-gradient-to-r from-hot-pink to-electric-blue text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-hot-pink/30 transition-all"
          >
            <Gavel size={16} className="mr-2" />
            Review Pending DMCA
          </Button>
          
          <Button 
            onClick={handleDownloadReport}
            className="w-full bg-charcoal text-white py-3 rounded-lg font-semibold border border-gray-600 hover:border-gray-500 transition-all"
          >
            <Download size={16} className="mr-2" />
            Download Report
          </Button>
          
          {/* Divider */}
          <div className="border-t border-gray-700 my-4"></div>
          
          <Button 
            onClick={handleAddContent}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-electric-blue transition-all"
          >
            <Plus size={16} className="mr-2" />
            Add Content
          </Button>
          
          <Button 
            onClick={handleSettings}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-electric-blue transition-all"
          >
            <Settings size={16} className="mr-2" />
            Configure Monitoring
          </Button>
        </div>
      </div>
    </Card>
  );
}
