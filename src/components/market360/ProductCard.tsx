import { Heart, MapPin, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "list";
}

export function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  if (layout === "list") {
    return (
      <Link to={`/product/${product.id}`}>
        <div className="flex gap-3 bg-card rounded-lg p-3 shadow-sm border border-border tap-highlight-none active:scale-[0.98] transition-transform">
          <img
            src={product.image}
            alt={product.title}
            className="w-24 h-24 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.title}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="w-3 h-3" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-primary">
                  ${product.price.amount.toLocaleString()}
                </span>
                {product.moq && (
                  <span className="text-xs text-muted-foreground ml-2">MOQ: {product.moq}</span>
                )}
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border tap-highlight-none active:scale-[0.98] transition-transform">
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full aspect-square object-cover"
          />
          {product.promotion && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
              {product.promotion.label}
            </Badge>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 bg-card/80 backdrop-blur-sm hover:bg-card"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-3">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs font-medium">{product.seller.name}</span>
            {product.seller.verified && (
              <Shield className="w-3 h-3 text-primary" />
            )}
          </div>
          
          <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.title}</h3>
          
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-lg font-bold text-primary">
              ${product.price.amount.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">{product.price.currency}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{product.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
