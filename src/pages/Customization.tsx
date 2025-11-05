import { useNavigate } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Package, Palette, Zap } from "lucide-react";

const services = [
  {
    icon: Package,
    title: "Custom Packaging",
    description: "Brand your products with custom packaging design",
    minOrder: "MOQ: 500 units",
  },
  {
    icon: Palette,
    title: "Product Customization",
    description: "Modify colors, materials, and specifications",
    minOrder: "MOQ: 100 units",
  },
  {
    icon: Sparkles,
    title: "Logo & Branding",
    description: "Add your logo and brand elements",
    minOrder: "MOQ: 50 units",
  },
  {
    icon: Zap,
    title: "Fast Production",
    description: "Express customization in 7-14 days",
    minOrder: "MOQ varies",
  },
];

export default function Customization() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <HeaderBar title="Fast Customization" />

      <div className="p-4 space-y-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <h2 className="text-2xl font-bold mb-2">Customize Your Products</h2>
          <p className="text-muted-foreground mb-4">
            Work directly with manufacturers to create products that match your exact specifications
          </p>
        </Card>

        <div className="space-y-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {service.description}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {service.minOrder}
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate("/quotation")}
                    >
                      Get Quote
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-4">
          <h3 className="font-bold mb-3">How It Works</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                1
              </div>
              <div>
                <p className="font-medium">Submit Requirements</p>
                <p className="text-sm text-muted-foreground">Tell us what you need</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                2
              </div>
              <div>
                <p className="font-medium">Review Quotes</p>
                <p className="text-sm text-muted-foreground">Compare offers from suppliers</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                3
              </div>
              <div>
                <p className="font-medium">Start Production</p>
                <p className="text-sm text-muted-foreground">Approve sample and begin</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
