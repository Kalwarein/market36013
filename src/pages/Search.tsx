import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/market360/Header";
import { PageContainer } from "@/components/market360/PageContainer";
import { ProductCard } from "@/components/market360/ProductCard";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { BottomNav } from "@/components/market360/BottomNav";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length >= 2) {
      searchProducts(query);
    } else {
      setProducts([]);
    }
  }, [query]);

  const searchProducts = async (searchQuery: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          store:stores (
            id,
            name,
            logo_url,
            verified
          ),
          images:product_images (url)
        `)
        .eq('published', true)
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
        .limit(50);

      if (error) throw error;

      const transformedProducts = data?.map((product: any) => ({
        id: product.id,
        product_id: product.product_id || product.id,
        title: product.title,
        price: { amount: product.price, currency: product.currency },
        image: product.images?.[0]?.url || '/placeholder.svg',
        location: product.place_of_origin || 'Unknown',
        stock: product.ready_to_ship ? 'In Stock' : 'Available',
        store: {
          name: product.store?.name || 'Unknown Store',
          logo: product.store?.logo_url || '/placeholder.svg',
          verified: product.store?.verified || false,
        },
      })) || [];

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      setSearchParams({ q: query });
    }
  };

  return (
    <PageContainer>
      <Header />

      <div className="p-4">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10"
              autoFocus
            />
          </div>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} layout="grid" />
            ))}
          </div>
        ) : query.length >= 2 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found for "{query}"</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Start typing to search products</p>
          </div>
        )}
      </div>

      <BottomNav />
    </PageContainer>
  );
}