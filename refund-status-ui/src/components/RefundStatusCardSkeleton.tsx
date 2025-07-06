import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { cn } from '@/lib/utils';
import { PredictionInfoSkeleton } from '@/components/PredictionInfoSkeleton.tsx';

export function RefundStatusCardSkeleton() {
  return (
    <Card className={cn('w-full py-0')}>
      <CardHeader className={cn('p-6 gap-2 rounded-t-xl bg-gray-100 dark:bg-gray-800')}>
        <CardTitle className="flex flex-col items-center text-xl font-normal text-gray-500 dark:text-gray-300">
          <Skeleton data-testid="refund-status-skeleton-label" className="h-4 w-32 mb-2" />
          <Skeleton data-testid="refund-status-skeleton-value" className="h-8 w-48 rounded" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <PredictionInfoSkeleton />
      </CardContent>

      <CardFooter className="flex justify-between py-2 border-t">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-8 rounded" />
      </CardFooter>
    </Card>
  );
}
