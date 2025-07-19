import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Gavel, 
  Send, 
  Eye, 
  Edit, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Copy 
} from "lucide-react";

interface DmcaNotice {
  id: number;
  infringementUrl: string;
  platform: string;
  status: 'pending' | 'approved' | 'sent' | 'responded';
  createdAt: string;
  sentAt?: string;
  subject: string;
  preview: string;
  violationType: string;
}

interface PlatformContact {
  name: string;
  email: string;
  form: string;
  instructions: string;
}

const platformContacts: Record<string, PlatformContact> = {
  google: {
    name: 'Google LLC',
    email: 'copyright@google.com',
    form: 'https://www.google.com/dmca.html',
    instructions: 'Use the online form for fastest processing. Include all evidence.'
  },
  bing: {
    name: 'Microsoft Corporation',
    email: 'dmca@microsoft.com',
    form: 'https://www.microsoft.com/en-us/legal/intellectualproperty/infringement',
    instructions: 'Submit via web form or email. Response within 24-48 hours.'
  },
  facebook: {
    name: 'Meta Platforms, Inc.',
    email: 'ip@meta.com',
    form: 'https://www.facebook.com/help/contact/1758255661104383',
    instructions: 'Report through Facebook Rights Manager for best results.'
  },
  instagram: {
    name: 'Meta Platforms, Inc.',
    email: 'ip@meta.com',
    form: 'https://help.instagram.com/454951664593304',
    instructions: 'Use Instagram Copyright Report form directly.'
  },
  youtube: {
    name: 'YouTube LLC',
    email: 'copyright@youtube.com',
    form: 'https://www.youtube.com/copyright_complaint_form',
    instructions: 'YouTube Copyright Complaint form required for video content.'
  }
};

export default function DMCA() {
  const { toast } = useToast();
  const [notices] = useState<DmcaNotice[]>([
    {
      id: 1,
      infringementUrl: 'https://example-violating-site.com/stolen-content',
      platform: 'google',
      status: 'pending',
      createdAt: '2024-07-16T10:30:00Z',
      subject: 'DMCA Takedown Notice - Professional Photography',
      preview: 'I am writing to notify you of copyright infringement occurring on your platform...',
      violationType: 'Image theft'
    },
    {
      id: 2,
      infringementUrl: 'https://social-platform.com/unauthorized-post',
      platform: 'facebook',
      status: 'sent',
      createdAt: '2024-07-16T08:15:00Z',
      sentAt: '2024-07-16T09:00:00Z',
      subject: 'DMCA Notice - Unauthorized Video Use',
      preview: 'This is a formal DMCA takedown notice pursuant to 17 U.S.C. § 512...',
      violationType: 'Video reproduction'
    },
    {
      id: 3,
      infringementUrl: 'https://blog-site.net/copied-article',
      platform: 'bing',
      status: 'responded',
      createdAt: '2024-07-15T16:45:00Z',
      sentAt: '2024-07-15T17:30:00Z',
      subject: 'Copyright Infringement - Digital Art',
      preview: 'Dear DMCA Agent, I hereby request that you remove or disable access...',
      violationType: 'Content copying'
    }
  ]);

  const [selectedNotice, setSelectedNotice] = useState<DmcaNotice | null>(null);
  const [customNotice, setCustomNotice] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-500">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-electric-blue/20 text-electric-blue">Approved</Badge>;
      case 'sent':
        return <Badge className="bg-neon-cyan/20 text-neon-cyan">Sent</Badge>;
      case 'responded':
        return <Badge className="bg-neon-green/20 text-neon-green">Responded</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={16} />;
      case 'approved':
        return <CheckCircle className="text-electric-blue" size={16} />;
      case 'sent':
        return <Send className="text-neon-cyan" size={16} />;
      case 'responded':
        return <CheckCircle className="text-neon-green" size={16} />;
      default:
        return <AlertTriangle className="text-gray-400" size={16} />;
    }
  };

  const approveNotice = (noticeId: number) => {
    toast({
      title: "DMCA Notice Approved",
      description: "The notice has been approved and will be sent to the platform.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "The DMCA notice has been copied to your clipboard.",
    });
  };

  const openPlatformForm = (platform: string) => {
    const contact = platformContacts[platform];
    if (contact?.form) {
      window.open(contact.form, '_blank');
      toast({
        title: "Platform Form Opened",
        description: `Opening ${contact.name} DMCA submission form.`,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gradient">DMCA Management</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Automated DMCA notice generation and submission tracking
            </p>
          </div>
          <div className="flex space-x-4 mt-4 lg:mt-0">
            <Button className="btn-electric">
              <Gavel size={20} className="mr-2" />
              Generate Notice
            </Button>
            <Button className="btn-hot">
              <Download size={20} className="mr-2" />
              Export Reports
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="notices" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-charcoal border border-gray-700">
          <TabsTrigger value="notices" className="data-[state=active]:bg-electric-blue data-[state=active]:text-white">
            DMCA Notices
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-electric-blue data-[state=active]:text-white">
            Templates
          </TabsTrigger>
          <TabsTrigger value="platforms" className="data-[state=active]:bg-electric-blue data-[state=active]:text-white">
            Platform Contacts
          </TabsTrigger>
        </TabsList>

        {/* DMCA Notices Tab */}
        <TabsContent value="notices" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notices List */}
            <Card className="gradient-border">
              <div className="gradient-border-inner p-6">
                <h2 className="text-xl font-bold text-white mb-4">Active Notices</h2>
                <div className="space-y-4">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="p-4 bg-charcoal/50 rounded-lg border border-gray-700 hover:border-electric-blue/50 transition-all cursor-pointer"
                      onClick={() => setSelectedNotice(notice)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm truncate">
                            {notice.subject}
                          </h3>
                          <p className="text-gray-400 text-xs mt-1">
                            {notice.infringementUrl}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusIcon(notice.status)}
                          {getStatusBadge(notice.status)}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                        {notice.preview}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Eye size={14} />
                          </Button>
                          {notice.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-electric-blue hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                approveNotice(notice.id);
                              }}
                            >
                              <CheckCircle size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Notice Preview */}
            <Card className="gradient-border">
              <div className="gradient-border-inner p-6">
                <h2 className="text-xl font-bold text-white mb-4">Notice Preview</h2>
                {selectedNotice ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-400">Platform</Label>
                        <p className="text-white capitalize">{selectedNotice.platform}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Status</Label>
                        {getStatusBadge(selectedNotice.status)}
                      </div>
                      <div>
                        <Label className="text-gray-400">Created</Label>
                        <p className="text-white">
                          {new Date(selectedNotice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Violation Type</Label>
                        <p className="text-white">{selectedNotice.violationType}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-400">Infringing URL</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input 
                          value={selectedNotice.infringementUrl} 
                          readOnly 
                          className="text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-white"
                          onClick={() => window.open(selectedNotice.infringementUrl, '_blank')}
                        >
                          <ExternalLink size={16} />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-400">Subject</Label>
                      <Input 
                        value={selectedNotice.subject} 
                        readOnly 
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-400">Notice Content</Label>
                      <Textarea 
                        value={selectedNotice.preview + "\n\n[Full DMCA notice content would appear here with all legal requirements, contact information, and sworn statements...]"}
                        readOnly 
                        rows={8}
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div className="flex space-x-3">
                      {selectedNotice.status === 'pending' && (
                        <Button 
                          onClick={() => approveNotice(selectedNotice.id)}
                          className="btn-electric"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Approve & Send
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => copyToClipboard(selectedNotice.preview)}
                        className="border-gray-600 text-gray-300"
                      >
                        <Copy size={16} className="mr-2" />
                        Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => openPlatformForm(selectedNotice.platform)}
                        className="border-gray-600 text-gray-300"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Platform Form
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Gavel className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-400">Select a notice to preview its content</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-6">
          <Card className="gradient-border">
            <div className="gradient-border-inner p-6">
              <h2 className="text-xl font-bold text-white mb-4">DMCA Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-charcoal/50 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-2">Standard Notice</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Basic DMCA takedown notice for most platforms
                  </p>
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                    Use Template
                  </Button>
                </div>
                <div className="p-4 bg-charcoal/50 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-2">Detailed Notice</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Comprehensive notice with evidence attachments
                  </p>
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                    Use Template
                  </Button>
                </div>
                <div className="p-4 bg-charcoal/50 rounded-lg border border-gray-700">
                  <h3 className="font-semibold text-white mb-2">Urgent Notice</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    For time-sensitive violations requiring immediate action
                  </p>
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                    Use Template
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Platform Contacts Tab */}
        <TabsContent value="platforms" className="mt-6">
          <Card className="gradient-border">
            <div className="gradient-border-inner p-6">
              <h2 className="text-xl font-bold text-white mb-4">Platform Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(platformContacts).map(([key, contact]) => (
                  <div key={key} className="p-4 bg-charcoal/50 rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-white mb-2 capitalize">
                      {key === 'google' ? 'Google™' : key === 'bing' ? 'Bing®' : contact.name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white ml-2">{contact.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Instructions:</span>
                        <p className="text-gray-300 mt-1">{contact.instructions}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3 border-gray-600 text-gray-300"
                        onClick={() => openPlatformForm(key)}
                      >
                        <ExternalLink size={14} className="mr-2" />
                        Open Form
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
