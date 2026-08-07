"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Settings, Building2, Receipt, Bell, Shield, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { mockCompanies } from "@/lib/mock-data";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const company = mockCompanies[0];
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    toast.success("Settings saved successfully!");
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Settings & Configuration"
        description="Configure company details, GST defaults, invoice templates, and system notifications"
        icon={Settings}
        actions={
          <Button onClick={handleSave}>
            {isSaved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        }
      />

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-xl">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="tax">Tax & GST</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="notif">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Company Profile</CardTitle>
              <CardDescription>Official business details shown on GST invoices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input defaultValue={company.name} />
                </div>
                <div className="space-y-2">
                  <Label>Company Code</Label>
                  <Input defaultValue={company.code} />
                </div>
                <div className="space-y-2">
                  <Label>GSTIN</Label>
                  <Input defaultValue={company.gst} />
                </div>
                <div className="space-y-2">
                  <Label>PAN</Label>
                  <Input defaultValue={company.pan} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={company.phone} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={company.email} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue={`${company.address.line1}, ${company.address.city}, ${company.address.state} - ${company.address.pincode}`} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">GST & Tax Defaults</CardTitle>
              <CardDescription>Default tax rates and HSN codes for bottled water & beverages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default GST Rate (%)</Label>
                  <Input defaultValue="18" />
                </div>
                <div className="space-y-2">
                  <Label>Default Water HSN Code</Label>
                  <Input defaultValue="2201" />
                </div>
                <div className="space-y-2">
                  <Label>Default Soda/Beverage HSN Code</Label>
                  <Input defaultValue="2202" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Invoice Customization</CardTitle>
              <CardDescription>Configure receipt formats, terms, and auto round-off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold text-sm">Auto Round-off Invoice Totals</p>
                  <p className="text-xs text-muted-foreground">Round grand totals to the nearest integer</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold text-sm">Print Thermal Receipt by Default</p>
                  <p className="text-xs text-muted-foreground">Use 80mm thermal format for quick POS printing</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notif" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Notification Channels</CardTitle>
              <CardDescription>Enable browser, WhatsApp, and SMS alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold text-sm">Low Stock Browser Alerts</p>
                  <p className="text-xs text-muted-foreground">Notify when stock drops below minimum threshold</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold text-sm">WhatsApp Payment Reminders</p>
                  <p className="text-xs text-muted-foreground">Send auto WhatsApp link for overdue payments</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
