import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Upload from "@/pages/upload";
import Monitoring from "@/pages/monitoring";
import DMCA from "@/pages/dmca";
import Billing from "@/pages/billing";
import Settings from "@/pages/settings";
import Legal from "@/pages/legal";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import RefundPolicyPage from "@/pages/refund-policy";
import Demo from "@/pages/demo";
import DMCATakedown from "@/pages/dmca-takedown";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isAdmin } = useRole();

  return (
    <Switch>
      {/* =========================== */}
      {/* PUBLIC ROUTES (Anyone) */}
      {/* =========================== */}
      <Route path="/legal" component={Legal} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/refund-policy" component={RefundPolicyPage} />
      <Route path="/demo" component={Demo} />
      <Route path="/dmca-takedown" component={DMCATakedown} />
      <Route path="/auth" component={Auth} />
      
      {/* =========================== */}
      {/* ADMIN ROUTES (Admin Only) */}
      {/* =========================== */}
      {isAuthenticated && isAdmin && (
        <>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/users" component={AdminUsers} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
        </>
      )}
      
      {/* =========================== */}
      {/* AUTHENTICATED USER ROUTES */}
      {/* =========================== */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/upload" component={Upload} />
          <Route path="/monitoring" component={Monitoring} />
          <Route path="/dmca" component={DMCA} />
          <Route path="/billing" component={Billing} />
          <Route path="/settings" component={Settings} />
        </>
      )}
      
      {/* =========================== */}
      {/* 404 FALLBACK */}
      {/* =========================== */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
