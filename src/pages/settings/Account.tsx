import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

export default function AccountSettings() {
  return (
    <PageContainer>
      <HeaderBar title="Account Settings" />

      <div className="p-4 space-y-4">
        {/* Profile Photo */}
        <Card className="p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Market360" />
                <AvatarFallback>WK</AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Change profile photo</p>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="p-4">
          <h3 className="font-bold mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Wello Kal" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="wello@market360.com" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue="+232 76 123 456" />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue="Freetown, Sierra Leone" />
            </div>
          </div>
        </Card>

        <Button className="w-full" size="lg">Save Changes</Button>
      </div>
    </PageContainer>
  );
}
