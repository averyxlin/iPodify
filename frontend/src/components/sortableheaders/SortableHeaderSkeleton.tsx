import { Skeleton } from "@/components/ui/skeleton";

export const SortableHeaderSkeleton = () => (
  <div className="flex flex-col items-center justify-center gap-0.5 w-full">
    <Skeleton className="h-4 w-16 mb-1" />
    <Skeleton className="h-4 w-4" />
  </div>
); 