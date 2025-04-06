import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PlusCircle, User } from "lucide-react";

export default function Clients() {
  const clients = [
    { id: 1, name: "Acme Corporation", email: "billing@acmecorp.com", phone: "(555) 123-4567", location: "New York, NY" },
    { id: 2, name: "Beta Industries", email: "finance@betaindustries.com", phone: "(555) 234-5678", location: "Chicago, IL" },
    { id: 3, name: "Gamma LLC", email: "accounting@gammallc.com", phone: "(555) 345-6789", location: "Los Angeles, CA" },
  ];

  return (
    <DashboardLayout>
      <PageHeader 
        title="Clients" 
        description="Manage your client information"
        actions={
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        }
      />
      
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <div key={client.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="px-6 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-500">{client.location}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 w-20">Email:</span>
                  <span className="text-sm text-gray-900">{client.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 w-20">Phone:</span>
                  <span className="text-sm text-gray-900">{client.phone}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-between">
              <Link href={`/clients/${client.id}`} className="text-sm font-medium text-primary hover:text-primary-dark">
                View Details
              </Link>
              <Link href={`/clients/${client.id}/edit`} className="text-sm font-medium text-primary hover:text-primary-dark">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}