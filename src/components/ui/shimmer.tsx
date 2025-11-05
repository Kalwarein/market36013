import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted",
        "bg-[length:200%_100%]",
        className
      )}
      style={{
        animation: "shimmer 2s infinite linear",
      }}
    />
  );
}

// Add to tailwind config if not present
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`;
