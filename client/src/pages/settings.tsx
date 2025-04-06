import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Save, 
  UserCog, 
  Bell, 
  Shield, 
  Languages, 
  Paintbrush, 
  CreditCard
} from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Settings" 
        description="Manage application settings"
        actions={
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        }
      />
      
      <div className="mt-6 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCog className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 ml-3">Account Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="Your Name" 
                  className="mt-1" 
                  defaultValue="Jane Smith"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  placeholder="your.email@example.com" 
                  className="mt-1"
                  defaultValue="jane.smith@savannahprime.com"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Input 
                  id="role" 
                  placeholder="Your Role" 
                  className="mt-1"
                  defaultValue="Administrator"
                  disabled
                />
              </div>
              
              <div>
                <Button variant="outline" className="mt-8">
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 ml-3">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Payment Alerts</h4>
                  <p className="text-sm text-gray-500">Get notified about payment status changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">System Updates</h4>
                  <p className="text-sm text-gray-500">Receive updates about system changes</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Marketing Communications</h4>
                  <p className="text-sm text-gray-500">Receive news and special offers</p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Paintbrush className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 ml-3">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Dark Mode</h4>
                  <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Compact Mode</h4>
                  <p className="text-sm text-gray-500">Reduce spacing in the UI</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Animations</h4>
                  <p className="text-sm text-gray-500">Enable interface animations</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 ml-3">Security & Privacy</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Session Timeout</h4>
                  <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                </div>
                <div className="w-32">
                  <Input defaultValue="30 minutes" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Data Sharing</h4>
                  <p className="text-sm text-gray-500">Share usage data to improve the application</p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}