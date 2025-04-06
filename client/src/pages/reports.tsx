import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Download, PieChart, BarChart, LineChart, Filter } from "lucide-react";

export default function Reports() {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Reports" 
        description="View financial and activity reports"
        actions={
          <div className="flex space-x-3">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />
      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">Revenue Report</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-4 h-48 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Revenue chart visualization</p>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Button variant="link" className="text-primary p-0 h-auto" size="sm">
              View full report
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">Invoice Status</h3>
              <BarChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-4 h-48 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Invoice status chart visualization</p>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Button variant="link" className="text-primary p-0 h-auto" size="sm">
              View full report
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">Client Activity</h3>
              <LineChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-4 h-48 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Client activity chart visualization</p>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Button variant="link" className="text-primary p-0 h-auto" size="sm">
              View full report
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-base font-medium text-gray-900">Recent Reports</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i} className="px-5 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <PieChart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Monthly Financial Report {2024 - i + 1}
                    </p>
                    <p className="text-xs text-gray-500">
                      Generated on April {i}, 2024
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}