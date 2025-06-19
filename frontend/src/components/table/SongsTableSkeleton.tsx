import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function SongsTableSkeleton() {
  return (
    <Card className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 my-8">
      <CardContent className="p-4">
        <Skeleton className="h-10 mb-4" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 mb-2" />
        ))}
      </CardContent>
    </Card>
  );
} 