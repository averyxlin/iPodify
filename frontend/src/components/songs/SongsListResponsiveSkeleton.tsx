import React from "react";
import { SongsTableSkeleton } from "./SongsTableSkeleton";
import { SongsCardListSkeleton } from "./SongsCardListSkeleton";
import { useMediaQuery } from "../../lib/useMediaQuery";

export function SongsListResponsiveSkeleton() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  if (isMobile) {
    return <SongsCardListSkeleton />;
  }
  return <SongsTableSkeleton />;
} 