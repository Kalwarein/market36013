import { useState, useEffect } from "react";
import { Grid3x3, List, Loader2 } from "lucide-react";
import { Header } from "@/components/market360/Header";
import { BottomNav } from "@/components/market360/BottomNav";
import { CategoryChips } from "@/components/market360/CategoryChips";
import { ProductCard } from "@/components/market360/ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function CategoryListing() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  const fetchCategoriesAndProducts = async () => {
    try {
      const { data: categoriesData } = await supabase
        .from('categories' as any)
        .select('*')
        .eq('published', true)
        .order('display_order');

      const { data: productsData } = await supabase
        .from('products')
        .select('*, store:stores(*), images:product_images(*)')
        .eq('published', true);

      setCategories([{ id: 'all', name: 'All', icon: 'grid', slug: 'all' }, ...(categoriesData || [])]);
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => p.category_id === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Header />
      
      {/* Sticky Filter Bar */}
      <div className="sticky top-[64px] z-40 bg-card border-b border-border">
        <div className="py-3">
          <CategoryChips
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
        
        <div className="flex items-center justify-between px-4 pb-3">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} products found
          </p>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={layout === "grid" ? "default" : "ghost"}
              onClick={() => setLayout("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={layout === "list" ? "default" : "ghost"}
              onClick={() => setLayout("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Grid/List */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category</p>
          </div>
        ) : layout === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  image: product.images?.[0]?.url || '/placeholder.svg',
                  seller: { 
                    name: product.store?.name || 'Unknown',
                    verified: product.store?.verified || false 
                  },
                  location: product.store?.location?.city || 'Unknown'
                }} 
                layout="grid" 
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  image: product.images?.[0]?.url || '/placeholder.svg',
                  seller: { 
                    name: product.store?.name || 'Unknown',
                    verified: product.store?.verified || false 
                  },
                  location: product.store?.location?.city || 'Unknown'
                }} 
                layout="list" 
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav visible={true} />
    </div>
  );
}
