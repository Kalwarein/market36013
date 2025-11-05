import { useState } from "react";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: true,
    messages: true,
    priceDrops: false,
    newsletter: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <PageContainer>
      <HeaderBar title="Notifications" />

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <h3 className="font-bold mb-4">Push Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="orderUpdates" className="flex-1">
                <div>
                  <p className="font-medium">Order Updates</p>
                  <p className="text-sm text-muted-foreground">Get notified about order status</p>
                </div>
              </Label>
              <Switch 
                id="orderUpdates" 
                checked={settings.orderUpdates}
                onCheckedChange={() => toggleSetting('orderUpdates')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="messages" className="flex-1">
                <div>
                  <p className="font-medium">New Messages</p>
                  <p className="text-sm text-muted-foreground">Alerts for new seller messages</p>
                </div>
              </Label>
              <Switch 
                id="messages" 
                checked={settings.messages}
                onCheckedChange={() => toggleSetting('messages')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="priceDrops" className="flex-1">
                <div>
                  <p className="font-medium">Price Drops</p>
                  <p className="text-sm text-muted-foreground">Notify when saved items drop in price</p>
                </div>
              </Label>
              <Switch 
                id="priceDrops" 
                checked={settings.priceDrops}
                onCheckedChange={() => toggleSetting('priceDrops')}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold mb-4">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="promotions" className="flex-1">
                <div>
                  <p className="font-medium">Promotions & Deals</p>
                  <p className="text-sm text-muted-foreground">Special offers and discounts</p>
                </div>
              </Label>
              <Switch 
                id="promotions" 
                checked={settings.promotions}
                onCheckedChange={() => toggleSetting('promotions')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="newsletter" className="flex-1">
                <div>
                  <p className="font-medium">Newsletter</p>
                  <p className="text-sm text-muted-foreground">Weekly market insights</p>
                </div>
              </Label>
              <Switch 
                id="newsletter" 
                checked={settings.newsletter}
                onCheckedChange={() => toggleSetting('newsletter')}
              />
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
