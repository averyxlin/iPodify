import React from "react";
import { TableSkeleton } from "../skeletons/TableSkeleton";
import { SongsCardListSkeleton } from "../cards/SongsCardListSkeleton";
import { useMediaQuery } from "../../lib/useMediaQuery";

export function SongsListResponsiveSkeleton() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  if (isMobile) {
    return <SongsCardListSkeleton />;
  }
  return <TableSkeleton />;
} 