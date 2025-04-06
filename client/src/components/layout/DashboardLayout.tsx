import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  Settings,
  PieChart,
  Menu,
  X,
  LogOut,
  CreditCard,
  ClipboardList,
  Home,
  Building2
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [location] = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Helper function to determine if a link is active
  const isActiveLink = (path: string) => {
    return location === path;
  };

  // Function to get the class names for a nav link based on its active state
  const getLinkClassName = (path: string) => {
    return isActiveLink(path)
      ? "bg-primary-50 text-primary group flex items-center px-3 py-2.5 text-sm font-medium rounded-md"
      : "text-gray-700 hover:bg-gray-50 hover:text-primary group flex items-center px-3 py-2.5 text-sm font-medium rounded-md";
  };

  // Function to get the icon class names based on active state
  const getIconClassName = (path: string) => {
    return isActiveLink(path)
      ? "text-primary mr-3 flex-shrink-0 h-5 w-5"
      : "text-gray-400 group-hover:text-primary mr-3 flex-shrink-0 h-5 w-5";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="mr-2"
                >
                  {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
              )}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-xl font-semibold text-primary hover:opacity-90 transition-opacity">
                  SavannahPrime Agency
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="ml-4">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div
          className={cn(
            "bg-white shadow-md border-r border-gray-200 w-64 flex-shrink-0 flex-col fixed md:relative h-full z-10 transition-all duration-300 ease-in-out",
            isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
          )}
        >
          <div className="h-full flex flex-col justify-between">
            <div className="px-4 py-6">
              <nav className="space-y-1">
                <Link 
                  href="/dashboard" 
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={getLinkClassName("/dashboard")}
                >
                  <Home className={getIconClassName("/dashboard")} />
                  Dashboard
                </Link>
                <Link 
                  href="/documents" 
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={getLinkClassName("/documents")}
                >
                  <FileText className={getIconClassName("/documents")} />
                  Documents
                </Link>
                <Link 
                  href="/clients" 
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={getLinkClassName("/clients")}
                >
                  <Users className={getIconClassName("/clients")} />
                  Clients
                </Link>
                <Link 
                  href="/payments" 
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={getLinkClassName("/payments")}
                >
                  <CreditCard className={getIconClassName("/payments")} />
                  Payments
                </Link>
                <Link 
                  href="/reports" 
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={getLinkClassName("/reports")}
                >
                  <PieChart className={getIconClassName("/reports")} />
                  Reports
                </Link>
                <Link 
                  href="/templates" 
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={getLinkClassName("/templates")}
                >
                  <ClipboardList className={getIconClassName("/templates")} />
                  Templates
                </Link>
                <Link 
                  href="/company" 
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={getLinkClassName("/company")}
                >
                  <Building2 className={getIconClassName("/company")} />
                  Company
                </Link>
              </nav>
            </div>
            <div className="border-t border-gray-200 p-4">
              <Link 
                href="/settings" 
                onClick={() => isMobile && setSidebarOpen(false)}
                className={getLinkClassName("/settings")}
              >
                <Settings className={getIconClassName("/settings")} />
                Settings
              </Link>
              <div className="mt-4 px-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                      SP
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      SavannahPrime
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      admin@savannahprime.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-50 z-0"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <main className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}