import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Shield, 
  Upload, 
  Search, 
  Gavel, 
  CreditCard, 
  Settings, 
  Scale, 
  Bell, 
  User, 
  Menu, 
  ChevronDown 
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: Shield },
  { path: "/upload", label: "Upload", icon: Upload },
  { path: "/monitoring", label: "Monitoring", icon: Search },
  { path: "/dmca", label: "DMCA", icon: Gavel },
  { path: "/billing", label: "Billing", icon: CreditCard },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/legal", label: "Legal", icon: Scale },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-charcoal border-b border-electric-blue/30 sticky top-0 z-50 backdrop-blur-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-r from-electric-blue to-neon-cyan rounded-lg flex items-center justify-center">
              <Shield className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">
                KlinkyLinks
              </h1>
              <p className="text-xs text-gray-400">Content Protection</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path || 
                             (item.path === "/dashboard" && location === "/");
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-neon-cyan border-b-2 border-neon-cyan pb-1"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative p-2 text-gray-300 hover:text-white">
              <Bell size={20} />
              <Badge className="absolute -top-1 -right-1 bg-hot-pink text-white text-xs h-5 w-5 flex items-center justify-center">
                3
              </Badge>
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-hot-pink to-electric-blue rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium">John Creator</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2 text-gray-300 hover:text-white">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-charcoal border-l border-gray-700">
                <div className="flex flex-col space-y-6 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.path || 
                                   (item.path === "/dashboard" && location === "/");
                    
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-electric-blue/20 text-neon-cyan border border-electric-blue/30"
                            : "text-gray-300 hover:text-white hover:bg-gray-800"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
