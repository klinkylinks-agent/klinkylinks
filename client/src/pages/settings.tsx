import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Bell, 
  Shield, 
  Key, 
  Globe, 
  Save, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff 
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Profile Settings
  const [profile, setProfile] = useState({
    name: "John Creator",
    email: "john@example.com",
    username: "johncreator",
    bio: "Professional content creator specializing in digital media protection.",
    website: "https://johncreator.com",
    timezone: "America/New_York",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailViolations: true,
    emailDmca: true,
    emailReports: false,
    pushViolations: true,
    pushDmca: false,
    pushReports: false,
    weeklyDigest: true,
    monthlyReport: true,
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactor: false,
    apiKey: "kl_live_abc123def456...",
    sessionTimeout: "24",
  });

  // Monitoring Settings
  const [monitoring, setMonitoring] = useState({
    scanFrequency: "hourly",
    platforms: {
      googleImages: true,
      googleVideos: true,
      bingImages: true,
      bingVideos: true,
    },
    sensitivity: "medium",
    autoGenerate: false,
    autoApprove: false,
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Security Updated",
      description: "Your security settings have been updated.",
    });
  };

  const handleSaveMonitoring = () => {
    toast({
      title: "Monitoring Updated",
      description: "Your monitoring preferences have been saved.",
    });
  };

  const generateNewApiKey = () => {
    const newKey = "kl_live_" + Math.random().toString(36).substr(2, 24);
    setSecurity(prev => ({ ...prev, apiKey: newKey }));
    toast({
      title: "New API Key Generated",
      description: "Your new API key has been generated. Make sure to update your integrations.",
      variant: "destructive",
    });
  };

  const deleteAccount = () => {
    toast({
      title: "Account Deletion Requested",
      description: "Please contact support to complete account deletion process.",
      variant: "destructive",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Settings</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Manage your account, notifications, and monitoring preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-charcoal border border-gray-700">
          <TabsTrigger value="profile" className="data-[state=active]:bg-electric-blue data-[state=active]:text-white">
            <User size={16} className="mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-electric-blue data-[state=active]:text-white">
            <Bell size={16} className="mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-electric-blue data-[state=active]:text-white">
            <Shield size={16} className="mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-electric-blue data-[state=active]:text-white">
            <Globe size={16} className="mr-2" />
            Monitoring
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="mt-6">
          <Card className="gradient-border">
            <div className="gradient-border-inner p-6">
              <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="website" className="text-white">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="timezone" className="text-white">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleSaveProfile} className="btn-electric mt-6">
                <Save size={16} className="mr-2" />
                Save Profile
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="gradient-border">
            <div className="gradient-border-inner p-6">
              <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Violation Alerts</Label>
                        <p className="text-gray-400 text-sm">Get notified when new violations are detected</p>
                      </div>
                      <Switch
                        checked={notifications.emailViolations}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailViolations: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">DMCA Updates</Label>
                        <p className="text-gray-400 text-sm">Updates on DMCA notice status and responses</p>
                      </div>
                      <Switch
                        checked={notifications.emailDmca}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailDmca: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Weekly Digest</Label>
                        <p className="text-gray-400 text-sm">Summary of protection activity</p>
                      </div>
                      <Switch
                        checked={notifications.weeklyDigest}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyDigest: checked }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Urgent Violations</Label>
                        <p className="text-gray-400 text-sm">High-priority violations requiring immediate attention</p>
                      </div>
                      <Switch
                        checked={notifications.pushViolations}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushViolations: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveNotifications} className="btn-electric mt-6">
                <Save size={16} className="mr-2" />
                Save Notifications
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6">
          <Card className="gradient-border">
            <div className="gradient-border-inner p-6">
              <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Two-Factor Authentication</Label>
                    <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactor: checked }))}
                  />
                </div>
                
                <div>
                  <Label className="text-white">API Key</Label>
                  <p className="text-gray-400 text-sm mb-2">Use this key to access the KlinkyLinks API</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        value={showApiKey ? security.apiKey : "••••••••••••••••••••••••"}
                        readOnly
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={generateNewApiKey}
                      className="border-gray-600 text-gray-300"
                    >
                      <Key size={16} className="mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-white">Session Timeout</Label>
                  <p className="text-gray-400 text-sm mb-2">Automatically log out after inactivity</p>
                  <Select value={security.sessionTimeout} onValueChange={(value) => setSecurity(prev => ({ ...prev, sessionTimeout: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="168">1 week</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleSaveSecurity} className="btn-electric mt-6">
                <Save size={16} className="mr-2" />
                Save Security
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Monitoring Settings */}
        <TabsContent value="monitoring" className="mt-6">
          <Card className="gradient-border">
            <div className="gradient-border-inner p-6">
              <h2 className="text-xl font-bold text-white mb-6">Monitoring Configuration</h2>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-white">Scan Frequency</Label>
                  <p className="text-gray-400 text-sm mb-2">How often to check for new violations</p>
                  <Select value={monitoring.scanFrequency} onValueChange={(value) => setMonitoring(prev => ({ ...prev, scanFrequency: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Monitoring Platforms</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Google™ Images</Label>
                      <Switch
                        checked={monitoring.platforms.googleImages}
                        onCheckedChange={(checked) => setMonitoring(prev => ({ 
                          ...prev, 
                          platforms: { ...prev.platforms, googleImages: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Google™ Videos</Label>
                      <Switch
                        checked={monitoring.platforms.googleVideos}
                        onCheckedChange={(checked) => setMonitoring(prev => ({ 
                          ...prev, 
                          platforms: { ...prev.platforms, googleVideos: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Bing® Images</Label>
                      <Switch
                        checked={monitoring.platforms.bingImages}
                        onCheckedChange={(checked) => setMonitoring(prev => ({ 
                          ...prev, 
                          platforms: { ...prev.platforms, bingImages: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Bing® Videos</Label>
                      <Switch
                        checked={monitoring.platforms.bingVideos}
                        onCheckedChange={(checked) => setMonitoring(prev => ({ 
                          ...prev, 
                          platforms: { ...prev.platforms, bingVideos: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-white">Detection Sensitivity</Label>
                  <p className="text-gray-400 text-sm mb-2">How strict to be when detecting potential violations</p>
                  <Select value={monitoring.sensitivity} onValueChange={(value) => setMonitoring(prev => ({ ...prev, sensitivity: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (fewer false positives)</SelectItem>
                      <SelectItem value="medium">Medium (balanced)</SelectItem>
                      <SelectItem value="high">High (catch everything)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Auto-generate DMCA</Label>
                      <p className="text-gray-400 text-sm">Automatically create DMCA notices for detected violations</p>
                    </div>
                    <Switch
                      checked={monitoring.autoGenerate}
                      onCheckedChange={(checked) => setMonitoring(prev => ({ ...prev, autoGenerate: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Auto-approve DMCA</Label>
                      <p className="text-gray-400 text-sm">Automatically send generated DMCA notices (use with caution)</p>
                    </div>
                    <Switch
                      checked={monitoring.autoApprove}
                      onCheckedChange={(checked) => setMonitoring(prev => ({ ...prev, autoApprove: checked }))}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveMonitoring} className="btn-electric mt-6">
                <Save size={16} className="mr-2" />
                Save Monitoring
              </Button>
            </div>
          </Card>
          
          {/* Danger Zone */}
          <Card className="gradient-border mt-8">
            <div className="gradient-border-inner p-6">
              <h2 className="text-xl font-bold text-hot-pink mb-4 flex items-center">
                <AlertTriangle size={20} className="mr-2" />
                Danger Zone
              </h2>
              <p className="text-gray-400 mb-4">
                These actions are permanent and cannot be undone.
              </p>
              <Button
                onClick={deleteAccount}
                variant="destructive"
                className="bg-hot-pink hover:bg-hot-pink/80"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Account
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
