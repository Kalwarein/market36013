import { useNavigate } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket, Clock } from "lucide-react";

const coupons = [
  {
    id: "c1",
    title: "US$100 Off",
    description: "On orders over $500",
    discount: "$100",
    code: "SAVE100",
    expiry: "Dec 31, 2025",
    minSpend: 500,
  },
  {
    id: "c2",
    title: "20% Off Electronics",
    description: "Valid on all electronic items",
    discount: "20%",
    code: "TECH20",
    expiry: "Dec 15, 2025",
    minSpend: 200,
  },
  {
    id: "c3",
    title: "Free Shipping",
    description: "No minimum purchase required",
    discount: "Free Ship",
    code: "FREESHIP",
    expiry: "Jan 31, 2026",
    minSpend: 0,
  },
  {
    id: "c4",
    title: "First Order Discount",
    description: "15% off your first order",
    discount: "15%",
    code: "WELCOME15",
    expiry: "Dec 31, 2025",
    minSpend: 100,
  },
];

export default function Coupons() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <HeaderBar title="Coupons & Credits" />

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">Available Coupons</h2>
          <Badge variant="secondary">{coupons.length} Active</Badge>
        </div>

        {coupons.map((coupon) => (
          <Card key={coupon.id} className="p-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Ticket className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold mb-1">{coupon.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {coupon.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="font-mono text-xs">
                    {coupon.code}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Expires {coupon.expiry}</span>
                  </div>
                </div>
                {coupon.minSpend > 0 && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Min. spend: ${coupon.minSpend}
                  </p>
                )}
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/cart")}
                >
                  Use Now
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <Card className="p-6 text-center bg-muted/30">
          <Ticket className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-bold mb-2">Get More Coupons</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete purchases and participate in promotions to earn more coupons
          </p>
          <Button variant="outline" onClick={() => navigate("/")}>
            Browse Products
          </Button>
        </Card>
      </div>
    </PageContainer>
  );
}
