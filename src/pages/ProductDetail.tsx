import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, Share2, Shield, Star, MapPin, MessageCircle, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductCarousel } from "@/components/market360/ProductCarousel";
import { supabase } from "@/integrations/supabase/client";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data: productData } = await supabase
        .from('products')
        .select('*, store:stores(*), images:product_images(*), variants:product_variants(*)')
        .eq('id', id)
        .single();

      if (productData) {
        setProduct(productData);

        // Fetch related products
        const { data: related } = await supabase
          .from('products')
          .select('*, images:product_images(url)')
          .eq('category_id', productData.category_id)
          .neq('id', id)
          .eq('published', true)
          .limit(6);

        setRelatedProducts(related || []);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Product not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-1 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="relative bg-card">
        <img
          src={product.images?.[0]?.url || '/placeholder.svg'}
          alt={product.title}
          className="w-full aspect-square object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 bg-card mb-2">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{product.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-primary">
            ${product.price?.toLocaleString() || '0'}
          </span>
          <span className="text-sm text-muted-foreground">{product.currency || 'USD'}</span>
        </div>

        {product.moq && (
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-muted-foreground">MOQ: {product.moq} units</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(Math.max(product.moq || 1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button size="sm" variant="outline" onClick={() => setQuantity(quantity + 1)}>
                +
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Seller Info */}
      <div className="p-4 bg-card mb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              {product.store?.logo_url ? (
                <img src={product.store.logo_url} alt={product.store.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="font-bold text-lg">{product.store?.name?.charAt(0) || 'S'}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{product.store?.name || 'Store'}</span>
                {product.store?.verified && <Shield className="w-4 h-4 text-primary" />}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate(`/store/${product.store_id}`)}>
            Visit Store
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact
          </Button>
          <Button className="w-full bg-secondary hover:bg-secondary/90">
            Inquire
          </Button>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="p-4 bg-card mb-2">
          <h2 className="font-bold mb-2">Description</h2>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
      )}

      {/* Specifications */}
      {product.metadata && Object.keys(product.metadata).length > 0 && (
        <div className="bg-card mb-2">
          <Accordion type="single" collapsible>
            <AccordionItem value="specs">
              <AccordionTrigger className="px-4">Specifications</AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="space-y-2">
                  {Object.entries(product.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-card pt-4">
          <ProductCarousel title="Related Products" products={relatedProducts} />
        </div>
      )}

      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40 safe-bottom">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" className="w-full">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
