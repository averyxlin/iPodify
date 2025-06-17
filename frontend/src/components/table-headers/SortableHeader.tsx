import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableHeaderProps {
  label: string;
  active: boolean;
  direction: "asc" | "desc" | null;
  onClick: () => void;
}

export function SortableHeader({
  label,
  active,
  direction,
  onClick,
}: SortableHeaderProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-1 py-2 px-4"
    >
      <span>{label}</span>
      {active && (
        <span className="text-gray-500">
          {direction === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      )}
    </Button>
  );
} 