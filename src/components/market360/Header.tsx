import { Search, Camera, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border safe-top">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <h1 className="text-lg font-bold text-primary hidden sm:block">Market360</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search products, services..."
            className="w-full pl-10 pr-10 h-10 rounded-full bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            onClick={() => navigate("/search")}
            readOnly
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            onClick={() => navigate("/search")}
          >
            <Camera className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Account */}
        <Button size="icon" variant="ghost" className="rounded-full">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
