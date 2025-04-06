import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Dashboard" 
        description="Welcome to your SavannahPrime Agency dashboard"
      />
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <h3 className="text-sm font-medium text-gray-700">Total Documents</h3>
            <p className="text-2xl font-bold text-primary mt-2">12</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-sm font-medium text-gray-700">Total Clients</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">5</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-medium text-gray-700">Total Revenue</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">$2,450</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}