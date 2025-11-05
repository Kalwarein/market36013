import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { ProductCard } from "@/components/market360/ProductCard";
import { products } from "@/data/mockData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";

export default function Ranking() {
  const topProducts = products.slice(0, 10);

  return (
    <PageContainer>
      <HeaderBar title="Top Ranking" />

      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-bold">Trending Products</h2>
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {topProducts.map((product, index) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} layout="grid" />
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="week" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {topProducts.slice(0, 8).map((product, index) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} layout="grid" />
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="month" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {topProducts.map((product, index) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} layout="grid" />
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
