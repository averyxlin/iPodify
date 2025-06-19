import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function TableSkeleton() {
  return (
    <Card className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 my-8">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="border-b">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-1 p-4">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="border-b last:border-b-0">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex-1 p-4">
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 