import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function SongCardSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <Skeleton className="aspect-square" />

      <CardContent className="p-4">
        <Skeleton className="h-4 mb-2" />
        <Skeleton className="h-3 mb-1 w-3/4" />
        <Skeleton className="h-3 mb-3 w-1/2" />
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
      </CardContent>
    </Card>
  );
} 