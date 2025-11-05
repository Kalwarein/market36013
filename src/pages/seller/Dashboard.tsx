import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload,
  Store,
  Image as ImageIcon,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSellerStatus } from "@/hooks/useSellerStatus";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const sellerStatus = useSellerStatus();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  
  const [storeData, setStoreData] = useState({
    name: "",
    slug: "",
    description: "",
    location: {
      country: "Sierra Leone",
      city: ""
    }
  });

  useEffect(() => {
    // Redirect if not seller
    if (!sellerStatus.loading && !sellerStatus.isSeller) {
      toast.error("You need to complete seller onboarding first");
      navigate("/seller/setup");
    }

    // Load existing store if available
    if (sellerStatus.hasStore && sellerStatus.storeId) {
      fetchStore();
    }
  }, [sellerStatus]);

  const fetchStore = async () => {
    const { data } = await supabase
      .from('stores')
      .select('*')
      .eq('id', sellerStatus.storeId)
      .single();

    if (data) {
      const location = typeof data.location === 'object' && data.location !== null
        ? data.location as { country?: string; city?: string }
        : { country: "Sierra Leone", city: "" };
      
      setStoreData({
        name: data.name,
        slug: data.slug || "",
        description: data.description || "",
        location: {
          country: location.country || "Sierra Leone",
          city: location.city || ""
        }
      });
      setLogoPreview(data.logo_url || "");
      setBannerPreview(data.cover_url || "");
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}/${user?.id}/${Date.now()}.${fileExt}`;
    
    const { error, data } = await supabase.storage
      .from('store-assets')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('store-assets')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = logoPreview;
      let bannerUrl = bannerPreview;

      // Upload new images if selected
      if (logoFile) {
        logoUrl = await uploadImage(logoFile, 'logos');
      }
      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, 'banners');
      }

      // Create or update store
      const storePayload = {
        user_id: user?.id,
        name: storeData.name,
        slug: storeData.slug || storeData.name.toLowerCase().replace(/\s+/g, '-'),
        description: storeData.description,
        logo_url: logoUrl,
        cover_url: bannerUrl,
        location: storeData.location as any,
        status: 'active' as const
      };

      if (sellerStatus.hasStore && sellerStatus.storeId) {
        // Update existing store
        const { error } = await supabase
          .from('stores')
          .update(storePayload)
          .eq('id', sellerStatus.storeId);

        if (error) throw error;
        toast.success("Store updated successfully!");
      } else {
        // Create new store
        const { error } = await supabase
          .from('stores')
          .insert(storePayload);

        if (error) throw error;
        toast.success("Store created successfully!");
      }

      navigate("/seller/products");
    } catch (error: any) {
      console.error('Error saving store:', error);
      toast.error(error.message || "Failed to save store");
    } finally {
      setLoading(false);
    }
  };

  if (sellerStatus.loading) {
    return (
      <PageContainer showBottomNav>
        <HeaderBar title="Seller Dashboard" showBack={false} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Store className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer showBottomNav>
      <HeaderBar title={sellerStatus.hasStore ? "Store Settings" : "Setup Your Store"} showBack={true} />

      <div className="p-4">
        <Card className="p-6">
          <div className="text-center mb-6">
            <Store className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">
              {sellerStatus.hasStore ? "Update Your Store" : "Create Your Store"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {sellerStatus.hasStore 
                ? "Update your store information and images" 
                : "Add your store logo, banner, and details to start selling"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Logo */}
            <div>
              <Label>Store Logo *</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload logo</p>
                      <p className="text-xs text-muted-foreground">Square image recommended (500x500px)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Store Banner */}
            <div>
              <Label>Store Banner *</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  {bannerPreview ? (
                    <div className="relative w-full">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload banner</p>
                      <p className="text-xs text-muted-foreground">Wide image recommended (1200x400px)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Store Name */}
            <div>
              <Label htmlFor="store_name">Store Name *</Label>
              <Input
                id="store_name"
                value={storeData.name}
                onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                placeholder="e.g., Tech Hub SL"
                required
              />
            </div>

            {/* Store Slug */}
            <div>
              <Label htmlFor="store_slug">Store URL</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">market360.com/store/</span>
                <Input
                  id="store_slug"
                  value={storeData.slug}
                  onChange={(e) => setStoreData({ ...storeData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="tech-hub-sl"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Store Description *</Label>
              <Textarea
                id="description"
                value={storeData.description}
                onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                placeholder="Tell buyers about your store..."
                rows={4}
                required
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={storeData.location.city}
                onChange={(e) => setStoreData({ 
                  ...storeData, 
                  location: { ...storeData.location, city: e.target.value }
                })}
                placeholder="Freetown"
                required
              />
            </div>

            {/* Success Info */}
            {sellerStatus.hasStore && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-primary mb-1">Store Active!</p>
                    <p className="text-muted-foreground">
                      Your store is live. Update your information anytime.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : sellerStatus.hasStore ? "Update Store" : "Create Store"}
            </Button>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
