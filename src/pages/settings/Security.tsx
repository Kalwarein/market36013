import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lock, Smartphone, Key } from "lucide-react";

export default function SecuritySettings() {
  return (
    <PageContainer>
      <HeaderBar title="Security" />

      <div className="p-4 space-y-4">
        <Card className="divide-y">
          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Not enabled</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">Active Sessions</p>
                <p className="text-sm text-muted-foreground">Manage your devices</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold mb-4">Privacy</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Download My Data
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive">
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
