import { Laptop, Shield, Building, Shirt, Home, Grid3x3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/data/mockData";

interface CategoryChipsProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}

const iconMap: Record<string, any> = {
  grid: Grid3x3,
  laptop: Laptop,
  shield: Shield,
  building: Building,
  shirt: Shirt,
  home: Home,
};

export function CategoryChips({
  categories,
  activeCategory = "all",
  onCategoryChange,
}: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide">
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || Grid3x3;
        const isActive = activeCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange?.(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-colors tap-highlight-none flex-shrink-0",
              isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
