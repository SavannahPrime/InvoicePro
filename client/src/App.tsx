import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Documents from "@/pages/documents";
import Clients from "@/pages/clients";
import Payments from "@/pages/payments";
import Reports from "@/pages/reports";
import Templates from "@/pages/templates";
import Company from "@/pages/company";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      {/* Redirect root to dashboard */}
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
      
      {/* Main application routes */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/documents" component={Documents} />
      <Route path="/clients" component={Clients} />
      <Route path="/payments" component={Payments} />
      <Route path="/reports" component={Reports} />
      <Route path="/templates" component={Templates} />
      <Route path="/company" component={Company} />
      <Route path="/settings" component={Settings} />
      
      {/* Legacy home route - can remove later */}
      <Route path="/home" component={Home} />
      
      {/* 404 - Not Found */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
