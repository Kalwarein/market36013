import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { ProductCard } from "@/components/market360/ProductCard";
import { products } from "@/data/mockData";
import { Heart } from "lucide-react";

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(products.slice(0, 6));

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PageContainer>
      <HeaderBar title="My Favorites" />

      <div className="p-4">
        {favorites.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {favorites.length} saved items
            </p>
            <div className="grid grid-cols-2 gap-3">
              {favorites.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} layout="grid" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFavorite(product.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card shadow-md flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="font-bold mb-2">No favorites yet</h3>
            <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
              Save items you like to find them easily later
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium"
            >
              Browse Products
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
