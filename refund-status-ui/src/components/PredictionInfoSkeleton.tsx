import { Skeleton } from '@/components/ui/skeleton.tsx';

export function PredictionInfoSkeleton() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>

      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-40 mb-4" />

      <hr className="my-4" />

      <Skeleton className="h-5 w-60 mb-2" />

      <ul className="space-y-2 ml-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <li key={`faster-${i}`} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </li>
        ))}
      </ul>

      <hr className="my-4" />

      <Skeleton className="h-5 w-72 mb-2" />

      <ul className="space-y-2 ml-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <li key={`slower-${i}`} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-4 rounded" />
          </li>
        ))}
      </ul>
    </div>
  );
}
