import { useNavigate } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/mockData";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export default function SellerProducts() {
  const navigate = useNavigate();
  const myProducts = products.slice(0, 5);

  return (
    <PageContainer>
      <HeaderBar 
        title="My Products" 
        actions={
          <Button size="sm" onClick={() => navigate("/seller/products/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        }
      />

      <div className="p-4 space-y-3">
        {myProducts.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex gap-3">
              <img
                src={product.image}
                alt={product.title}
                className="w-20 h-20 rounded object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm line-clamp-2">{product.title}</h3>
                  <Badge variant={product.stock === "In Stock" ? "default" : "secondary"}>
                    {product.stock}
                  </Badge>
                </div>
                <p className="text-sm font-bold text-primary mb-2">
                  ${product.price.amount}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {Math.floor(Math.random() * 500)} views
                  </span>
                  <span>•</span>
                  <span>{Math.floor(Math.random() * 50)} sold</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
