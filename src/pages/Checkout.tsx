import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Wallet, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [loading, setLoading] = useState(false);

  // Mock cart total - TODO: Get from cart state/database
  const total = 7750;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({ title: "Please login to place order", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Get cart items
      const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products (
            id,
            title,
            price,
            store_id,
            images:product_images (url)
          )
        `)
        .eq('user_id', user.id);

      if (cartError) throw cartError;
      if (!cartItems || cartItems.length === 0) {
        toast({ title: "Cart is empty", variant: "destructive" });
        navigate('/cart');
        return;
      }

      // Group items by store
      const itemsByStore = cartItems.reduce((acc: any, item: any) => {
        const storeId = item.product.store_id;
        if (!acc[storeId]) acc[storeId] = [];
        acc[storeId].push(item);
        return acc;
      }, {});

      // Create orders for each store
      for (const [storeId, items] of Object.entries(itemsByStore) as any) {
        const totalAmount = items.reduce(
          (sum: number, item: any) => sum + item.product.price * item.quantity,
          0
        );

        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            store_id: storeId,
            total_amount: totalAmount + 10, // Add shipping
            status: 'pending',
            shipping_info: {
              method: deliveryMethod,
              address: deliveryMethod === 'delivery' ? {
                name: 'User Name', // Get from form
                phone: 'Phone', // Get from form
                address: 'Address', // Get from form
              } : null,
            },
            payment_provider: paymentMethod,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        for (const item of items) {
          await supabase.from('order_items').insert({
            order_id: order.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            unit_price: item.product.price,
            total_price: item.product.price * item.quantity,
            title: item.product.title,
          });
        }

        // Clear cart for this store
        await supabase
          .from('cart_items')
          .delete()
          .in('id', items.map((i: any) => i.id));
      }

      toast({ title: "Order placed successfully!" });
      navigate('/orders');
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({ title: "Error placing order", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-1 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Checkout</h1>
        </div>
      </header>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Delivery Method */}
        <Card className="p-4">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Delivery Method
          </h2>
          <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
            <div className="flex items-start space-x-3 mb-3">
              <RadioGroupItem value="delivery" id="delivery" />
              <div className="flex-1">
                <Label htmlFor="delivery" className="font-medium cursor-pointer">
                  Home Delivery
                </Label>
                <p className="text-sm text-muted-foreground">Delivered to your address</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="pickup" id="pickup" />
              <div className="flex-1">
                <Label htmlFor="pickup" className="font-medium cursor-pointer">
                  Pickup from Seller
                </Label>
                <p className="text-sm text-muted-foreground">Arrange pickup with seller</p>
              </div>
            </div>
          </RadioGroup>
        </Card>

        {/* Delivery Address (if delivery selected) */}
        {deliveryMethod === "delivery" && (
          <Card className="p-4">
            <h2 className="font-bold mb-4">Delivery Address</h2>
            <div className="space-y-3">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+232 XX XXX XXXX" />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Street, City, Region" />
              </div>
            </div>
          </Card>
        )}

        {/* Payment Method */}
        <Card className="p-4">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-start space-x-3 mb-3">
              <RadioGroupItem value="card" id="card" />
              <div className="flex-1">
                <Label htmlFor="card" className="font-medium cursor-pointer">
                  Credit/Debit Card
                </Label>
                <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 mb-3">
              <RadioGroupItem value="mobile" id="mobile" />
              <div className="flex-1">
                <Label htmlFor="mobile" className="font-medium cursor-pointer">
                  Mobile Money
                </Label>
                <p className="text-sm text-muted-foreground">Orange Money, Africell Money</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="cash" id="cash" />
              <div className="flex-1">
                <Label htmlFor="cash" className="font-medium cursor-pointer">
                  Cash on Delivery
                </Label>
                <p className="text-sm text-muted-foreground">Pay when you receive</p>
              </div>
            </div>
          </RadioGroup>
        </Card>

        {/* Order Summary */}
        <Card className="p-4">
          <h2 className="font-bold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${(total - 50).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">$50</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span>Total</span>
              <span className="text-primary">${total.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-bottom">
        <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Place Order - ${total.toLocaleString()}
        </Button>
      </div>
    </div>
  );
}
