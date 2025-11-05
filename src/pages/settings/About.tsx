import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function AboutSettings() {
  return (
    <PageContainer>
      <HeaderBar title="About Market360" />

      <div className="p-4 space-y-4">
        <div className="flex flex-col items-center py-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-2xl">M</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Market360</h2>
          <p className="text-muted-foreground mb-1">Version 1.0.0</p>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Connecting buyers and sellers across West Africa
          </p>
        </div>

        <Card className="divide-y">
          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <span className="font-medium">Terms of Service</span>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <span className="font-medium">Privacy Policy</span>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <span className="font-medium">Licenses</span>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </button>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold mb-3">Contact Us</h3>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">Email: support@market360.com</p>
            <p className="text-muted-foreground">Phone: +232 76 123 456</p>
            <p className="text-muted-foreground">Address: Freetown, Sierra Leone</p>
          </div>
        </Card>

        <Button variant="outline" className="w-full">
          Rate Market360
        </Button>
      </div>
    </PageContainer>
  );
}
