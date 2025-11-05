import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/market360/Header";
import { BottomNav } from "@/components/market360/BottomNav";
import { CategoryChips } from "@/components/market360/CategoryChips";
import { ProductCarousel } from "@/components/market360/ProductCarousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/mockData";
import { FileText, Grid3x3, Wand2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { Product } from "@/data/mockData";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          price,
          currency,
          moq,
          stores:store_id (
            name
          ),
          product_images (
            url
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedProducts: Product[] = data?.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        moq: p.moq || 1,
        image: p.product_images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        seller: {
          id: p.stores?.user_id || 'unknown',
          name: p.stores?.name || 'Unknown Store',
          verified: true,
          rating: 4.5
        },
        location: 'Global',
        price: {
          amount: parseFloat(p.price || 0),
          currency: p.currency || 'USD'
        },
        tags: [],
        stock: "100+"
      })) || [];

      setProducts(formattedProducts);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      icon: FileText, 
      label: "Request for Quotation", 
      path: "/quotation",
      color: "from-blue-500/10 to-blue-500/5 border-blue-500/20" 
    },
    { 
      icon: Grid3x3, 
      label: "Source by Category", 
      path: "/categories",
      color: "from-green-500/10 to-green-500/5 border-green-500/20" 
    },
    { 
      icon: Wand2, 
      label: "Fast Customization", 
      path: "/customization",
      color: "from-purple-500/10 to-purple-500/5 border-purple-500/20" 
    },
    { 
      icon: TrendingUp, 
      label: "Top Ranking", 
      path: "/ranking",
      color: "from-orange-500/10 to-orange-500/5 border-orange-500/20" 
    },
  ];

  // Show auth prompt if not logged in
  if (!user) {
    return (
      <div className="min-h-screen pb-24 bg-surface-1">
        <Header />
        
        <div className="px-4 py-12 text-center space-y-4">
          <h2 className="text-2xl font-bold">Welcome to Market360</h2>
          <p className="text-muted-foreground">
            Please sign in to access the marketplace
          </p>
          <Button onClick={() => navigate('/auth')} size="lg">
            Sign In / Sign Up
          </Button>
        </div>

        <BottomNav visible={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-surface-1">
      <Header />
      
      {/* Quick Actions */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.path}
                className={`p-4 cursor-pointer hover:shadow-md transition-all bg-gradient-to-br ${action.color}`}
                onClick={() => navigate(action.path)}
              >
                <Icon className="w-8 h-8 text-primary mb-2" />
                <p className="font-bold text-sm">{action.label}</p>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="py-2">
        <CategoryChips
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {loading ? (
        <div className="px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p className="text-muted-foreground">No products available yet</p>
        </div>
      ) : (
        <>
          <ProductCarousel 
            title="Featured Products" 
            products={products.slice(0, 6)}
          />
          
          <ProductCarousel 
            title="Recent Additions" 
            products={products.slice(6, 12)}
          />
          
          {products.length > 12 && (
            <ProductCarousel 
              title="More Products" 
              products={products.slice(12)}
            />
          )}
        </>
      )}

      <BottomNav visible={true} />
    </div>
  );
}
