import React from "react";

export function SongsTableSkeleton() {
  return (
    <div className="overflow-x-auto px-4 sm:px-8 md:px-16 lg:px-32 py-8">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        ))}
      </div>
    </div>
  );
} 