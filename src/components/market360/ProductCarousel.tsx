import { Product } from "@/data/mockData";
import { ProductCard } from "./ProductCard";

interface ProductCarouselProps {
  title: string;
  products: Product[];
  actionLabel?: string;
  onSeeAll?: () => void;
}

export function ProductCarousel({ title, products, actionLabel = "See all", onSeeAll }: ProductCarouselProps) {
  return (
    <section className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <button onClick={onSeeAll} className="text-sm text-primary font-medium">{actionLabel}</button>
      </div>
      
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {products.map((product) => (
          <div key={product.id} className="w-[160px] flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
