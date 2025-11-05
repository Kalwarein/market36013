import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { ReactNode } from "react";

interface HeaderBarProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  onMenuClick?: () => void;
  actions?: ReactNode;
}

export function HeaderBar({ 
  title, 
  showBack = true, 
  showMenu = false,
  onMenuClick,
  actions 
}: HeaderBarProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {showMenu && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onMenuClick}
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
