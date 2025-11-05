import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { useSellerStatus } from "@/hooks/useSellerStatus";

export default function ProductNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { storeId } = useSellerStatus();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<Array<{ attributes: any; price: number; stock: number; sku: string }>>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    brand: "",
    model_number: "",
    category_id: "",
    tags: [] as string[],
    material: "",
    place_of_origin: "",
    price: "",
    moq: "1",
    currency: "USD",
    warranty: "",
    return_policy: "",
    certificates: [] as string[],
    seo_title: "",
    seo_description: "",
    inquiry_only: false,
    ready_to_ship: false,
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      toast({ title: "Maximum 10 images allowed", variant: "destructive" });
      return;
    }
    
    setImages([...images, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { attributes: {}, price: 0, stock: 0, sku: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) {
      toast({ title: "No store found", variant: "destructive" });
      return;
    }

    if (images.length < 1) {
      toast({ title: "Please add at least 1 product image", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          store_id: storeId,
          title: formData.title,
          description: formData.description,
          brand: formData.brand,
          model_number: formData.model_number,
          price: parseFloat(formData.price),
          moq: parseInt(formData.moq),
          currency: formData.currency,
          tags: formData.tags,
          material: formData.material,
          place_of_origin: formData.place_of_origin,
          warranty: formData.warranty,
          return_policy: formData.return_policy,
          certificates: formData.certificates,
          seo_title: formData.seo_title,
          seo_description: formData.seo_description,
          inquiry_only: formData.inquiry_only,
          ready_to_ship: formData.ready_to_ship,
          published: true,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Upload images
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${product.id}/${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        await supabase.from('product_images').insert({
          product_id: product.id,
          url: publicUrl,
          position: i,
        });
      }

      // Create variants if any
      for (const variant of variants) {
        await supabase.from('product_variants').insert({
          product_id: product.id,
          ...variant,
        });
      }

      toast({ title: "Product created successfully!" });
      navigate('/seller/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({ title: "Error creating product", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <HeaderBar title="Add New Product" />

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <Card className="p-4">
          <h3 className="font-bold mb-3">Product Images *</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <img src={preview} alt="" className="w-full h-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < 10 && (
              <label className="aspect-square border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-muted">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-muted-foreground" />
              </label>
            )}
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="font-bold">Basic Information</h3>
          
          <div>
            <Label>Product Title *</Label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., High-Quality LED Bulbs"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed product description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Brand</Label>
              <Input
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
            <div>
              <Label>Model Number</Label>
              <Input
                value={formData.model_number}
                onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Material</Label>
              <Input
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              />
            </div>
            <div>
              <Label>Place of Origin</Label>
              <Input
                value={formData.place_of_origin}
                onChange={(e) => setFormData({ ...formData, place_of_origin: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Tags (comma separated)</Label>
            <Input
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
              placeholder="electronics, LED, energy-saving"
            />
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="font-bold">Pricing & Stock</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Base Price *</Label>
              <Input
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <Label>MOQ (Minimum Order)</Label>
              <Input
                type="number"
                value={formData.moq}
                onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Currency</Label>
            <Input
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            />
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="font-bold">Policies & Certificates</h3>
          
          <div>
            <Label>Warranty</Label>
            <Input
              value={formData.warranty}
              onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
              placeholder="e.g., 1 year warranty"
            />
          </div>

          <div>
            <Label>Return Policy</Label>
            <Textarea
              value={formData.return_policy}
              onChange={(e) => setFormData({ ...formData, return_policy: e.target.value })}
              placeholder="Describe your return policy"
            />
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="font-bold">SEO Settings</h3>
          
          <div>
            <Label>SEO Title</Label>
            <Input
              value={formData.seo_title}
              onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
              placeholder="Title for search engines"
            />
          </div>

          <div>
            <Label>SEO Description</Label>
            <Textarea
              value={formData.seo_description}
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              placeholder="Description for search engines (max 160 chars)"
              maxLength={160}
            />
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="font-bold">Product Options</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Inquiry Only</Label>
              <p className="text-xs text-muted-foreground">Users must contact you to order</p>
            </div>
            <Switch
              checked={formData.inquiry_only}
              onCheckedChange={(checked) => setFormData({ ...formData, inquiry_only: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Ready to Ship</Label>
              <p className="text-xs text-muted-foreground">Product is in stock and ready</p>
            </div>
            <Switch
              checked={formData.ready_to_ship}
              onCheckedChange={(checked) => setFormData({ ...formData, ready_to_ship: checked })}
            />
          </div>
        </Card>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Create Product
        </Button>
      </form>
    </PageContainer>
  );
}