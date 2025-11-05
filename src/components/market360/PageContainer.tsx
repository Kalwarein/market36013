import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface PageContainerProps {
  children: ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

export function PageContainer({ 
  children, 
  showBottomNav = false,
  className = "" 
}: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-surface-1 ${showBottomNav ? 'pb-24' : ''} ${className}`}>
      {children}
      {showBottomNav && <BottomNav visible={true} />}
    </div>
  );
}
