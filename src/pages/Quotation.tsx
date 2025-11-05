import { useState } from "react";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";

export default function Quotation() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    targetPrice: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Quotation Request Sent",
      description: "Sellers will review your request and send quotes soon.",
    });
  };

  return (
    <PageContainer>
      <HeaderBar title="Request for Quotation" />

      <div className="p-4">
        <Card className="p-6 mb-4 bg-primary/5">
          <div className="flex gap-3">
            <FileText className="w-6 h-6 text-primary shrink-0" />
            <div>
              <h3 className="font-bold mb-1">How it works</h3>
              <p className="text-sm text-muted-foreground">
                Submit your requirements and receive competitive quotes from verified sellers within 24 hours.
              </p>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold mb-4">Product Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  placeholder="e.g., Industrial Generator"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="quantity">Quantity Needed *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 100 pieces"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="targetPrice">Target Price (Optional)</Label>
                <Input
                  id="targetPrice"
                  type="number"
                  placeholder="USD per unit"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Detailed Requirements *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe specifications, quality requirements, delivery timeline, etc."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>
          </Card>

          <Button type="submit" size="lg" className="w-full">
            Submit Request
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}
