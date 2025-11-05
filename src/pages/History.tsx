import { useNavigate } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { ProductCard } from "@/components/market360/ProductCard";
import { products } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function History() {
  const navigate = useNavigate();
  const recentlyViewed = products.slice(2, 8);

  return (
    <PageContainer>
      <HeaderBar 
        title="Browsing History" 
        actions={
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        }
      />

      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-4">
          Last 7 days
        </p>
        <div className="grid grid-cols-2 gap-3">
          {recentlyViewed.map((product) => (
            <ProductCard key={product.id} product={product} layout="grid" />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
