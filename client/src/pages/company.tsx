import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building2, Image, Mail, Phone, MapPin, Globe, Save } from "lucide-react";

export default function Company() {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Company Profile" 
        description="Manage your company information"
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
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 ml-3">Company Information</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  placeholder="SavannahPrime Agency" 
                  className="mt-1" 
                  defaultValue="SavannahPrime Agency"
                />
              </div>
              
              <div>
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input 
                  id="registrationNumber" 
                  placeholder="Registration Number" 
                  className="mt-1"
                  defaultValue="SP12345678"
                />
              </div>
              
              <div>
                <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                <Input 
                  id="taxId" 
                  placeholder="Tax ID / VAT Number" 
                  className="mt-1"
                  defaultValue="VAT-987654321"
                />
              </div>
              
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry" 
                  placeholder="Industry" 
                  className="mt-1"
                  defaultValue="Creative Services"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea 
                  id="companyDescription" 
                  placeholder="Description of your company..." 
                  className="mt-1"
                  rows={3}
                  defaultValue="SavannahPrime Agency provides premium creative services and innovative solutions for businesses looking to stand out in the digital landscape."
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Image className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 ml-3">Branding</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>Company Logo</Label>
                <div className="mt-1 flex items-center">
                  <div className="h-24 w-24 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <Button size="sm">Upload Logo</Button>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 200x200px. Max size: 2MB
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-md bg-primary"></div>
                  <Input 
                    id="primaryColor" 
                    placeholder="#0066CC" 
                    defaultValue="#0066CC"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-md bg-gray-800"></div>
                  <Input 
                    id="secondaryColor" 
                    placeholder="#1A1A1A" 
                    defaultValue="#1A1A1A"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 ml-3">Contact Information</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="mt-1 relative">
                  <Input 
                    id="email" 
                    placeholder="contact@savannahprime.com" 
                    className="pl-10"
                    defaultValue="contact@savannahprime.com"
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="mt-1 relative">
                  <Input 
                    id="phone" 
                    placeholder="+1 (555) 123-4567" 
                    className="pl-10"
                    defaultValue="+1 (555) 123-4567"
                  />
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <div className="mt-1 relative">
                  <Textarea 
                    id="address" 
                    placeholder="Company address..." 
                    className="pl-10"
                    rows={3}
                    defaultValue="123 Business Park, Suite 456, San Francisco, CA 94107, United States"
                  />
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="website">Website</Label>
                <div className="mt-1 relative">
                  <Input 
                    id="website" 
                    placeholder="https://www.savannahprime.com" 
                    className="pl-10"
                    defaultValue="https://www.savannahprime.com"
                  />
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
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