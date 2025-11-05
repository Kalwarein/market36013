import { useParams, useNavigate } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Truck, CheckCircle } from "lucide-react";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <PageContainer>
      <HeaderBar title={`Order ${orderId}`} />

      <div className="p-4 space-y-4">
        {/* Status Timeline */}
        <Card className="p-4">
          <h3 className="font-bold mb-4">Order Status</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="w-0.5 h-8 bg-primary" />
              </div>
              <div className="flex-1 pb-2">
                <p className="font-medium">Order Placed</p>
                <p className="text-sm text-muted-foreground">Nov 1, 2025 10:30 AM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="w-0.5 h-8 bg-primary" />
              </div>
              <div className="flex-1 pb-2">
                <p className="font-medium">Processing</p>
                <p className="text-sm text-muted-foreground">Nov 1, 2025 2:15 PM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="w-0.5 h-8 bg-muted" />
              </div>
              <div className="flex-1 pb-2">
                <p className="font-medium">Shipped</p>
                <p className="text-sm text-muted-foreground">Nov 2, 2025 9:00 AM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-muted-foreground">Delivered</p>
                <p className="text-sm text-muted-foreground">Estimated Nov 5, 2025</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-4">
          <h3 className="font-bold mb-4">Order Items</h3>
          <div className="flex gap-3 mb-4">
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
              alt="Product"
              className="w-20 h-20 rounded object-cover"
            />
            <div className="flex-1">
              <p className="font-medium mb-1">Professional Laptop - Business Edition</p>
              <p className="text-sm text-muted-foreground">Qty: 1</p>
              <p className="font-bold text-primary">$950</p>
            </div>
          </div>
        </Card>

        {/* Shipping Address */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-bold">Shipping Address</h3>
          </div>
          <p className="text-sm">Wello Kal</p>
          <p className="text-sm text-muted-foreground">123 Main Street</p>
          <p className="text-sm text-muted-foreground">Freetown, Sierra Leone</p>
          <p className="text-sm text-muted-foreground">+232 76 123 456</p>
        </Card>

        {/* Order Summary */}
        <Card className="p-4">
          <h3 className="font-bold mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>$950</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>$50</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">$1,000</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => navigate("/messenger")}>
            Contact Seller
          </Button>
          <Button className="flex-1">Track Order</Button>
        </div>
      </div>
    </PageContainer>
  );
}
