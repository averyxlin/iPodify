import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import React from "react";

type SortDirection = "asc" | "desc" | null;

interface SortableHeaderProps {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  className?: string;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  active,
  direction,
  onClick,
  className = "",
}) => (
  <Button
    variant="ghost"
    size="sm"
    className={`flex flex-col items-center justify-center gap-0.5 px-0 py-0 h-auto w-full ${className}`}
    onClick={onClick}
    tabIndex={0}
    aria-pressed={active}
  >
    <span className="text-sm font-medium">{label}</span>
    <span className="flex items-center justify-center h-4">
      {active ? (
        direction === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
      ) : (
        <span className="opacity-0">
          <ArrowUp size={16} />
        </span>
      )}
    </span>
  </Button>
); 