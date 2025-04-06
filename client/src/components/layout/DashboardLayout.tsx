import { ReactNode } from "react";
import { Link } from "wouter";
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
                <h1 className="text-xl font-semibold text-primary">
                  SavannahPrime Agency
                </h1>
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
                <Link href="/" className="text-gray-700 hover:bg-gray-50 hover:text-primary group flex items-center px-3 py-2.5 text-sm font-medium rounded-md">
                  <Home className="text-gray-400 group-hover:text-primary mr-3 flex-shrink-0 h-5 w-5" />
                  Dashboard
                </Link>
                <Link href="/" className="bg-primary-50 text-primary hover:bg-primary-100 group flex items-center px-3 py-2.5 text-sm font-medium rounded-md">
                  <FileText className="text-primary mr-3 flex-shrink-0 h-5 w-5" />
                  Documents
                </Link>
                <Link href="/" className="text-gray-700 hover:bg-gray-50 hover:text-primary group flex items-center px-3 py-2.5 text-sm font-medium rounded-md">
                  <Users className="text-gray-400 group-hover:text-primary mr-3 flex-shrink-0 h-5 w-5" />
                  Clients
                </Link>
                <Link href="/" className="text-gray-700 hover:bg-gray-50 hover:text-primary group flex items-center px-3 py-2.5 text-sm font-medium rounded-md">
                  <CreditCard className="text-gray-400 group-hover:text-primary mr-3 flex-shrink-0 h-5 w-5" />
                  Payments
                </Link>
                <Link href="/" className="text-gray-700 hover:bg-gray-50 hover:text-primary group flex items-center px-3 py-2.5 text-sm font-medium rounded-md">
                  <PieChart className="text-gray-400 group-hover:text-primary mr-3 flex-shrink-0 h-5 w-5" />
                  Reports
                </Link>
                <Link href="/" className="text-gray-700 hover:bg-gray-50 hover:text-primary group flex items-center px-3 py-2.5 text-sm font-medium rounded-md">
                  <ClipboardList className="text-gray-400 group-hover:text-primary mr-3 flex-shrink-0 h-5 w-5" />
                  Templates
                </Link>
                <Link href="/" className="text-gray-700 hover:bg-gray-50 hover:text-primary group flex items-center px-3 py-2.5 text-sm font-medium rounded-md">
                  <Building2 className="text-gray-400 group-hover:text-primary mr-3 flex-shrink-0 h-5 w-5" />
                  Company
                </Link>
              </nav>
            </div>
            <div className="border-t border-gray-200 p-4">
              <Link href="/" className="text-gray-700 hover:bg-gray-50 hover:text-primary group flex items-center px-3 py-2.5 text-sm font-medium rounded-md">
                <Settings className="text-gray-400 group-hover:text-primary mr-3 flex-shrink-0 h-5 w-5" />
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