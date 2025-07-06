import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { RefundStatus, RefundStatusType } from '@/types/RefundStatusTypes';
import { formatDistanceToNowIntl } from '@/lib/dateUtils';
import { Button } from '@/components/ui/button.tsx';
import { Loader2, RotateCcw } from 'lucide-react';
import { usePrediction } from '@/hooks/usePrediction.ts';
import { useEffect, useRef } from 'react';
import { PredictionInfoSkeleton } from '@/components/PredictionInfoSkeleton.tsx';
import { PredictionInfo } from '@/components/PredictionInfo.tsx';
import { isPredictable } from '@/lib/isPredictable.ts';

export function RefundStatusCard({
  refundStatus,
  loading,
  onRefresh
}: {
  refundStatus: RefundStatus | undefined;
  loading: boolean;
  onRefresh: () => void;
}) {
  const { prediction, loading: predicting, error: predictError, getPrediction } = usePrediction();

  const lastFetchedTimestamp = useRef<string | null>(null);
  const isPredictableStatus = isPredictable(refundStatus?.status as RefundStatusType);

  useEffect(() => {
    if (
      refundStatus &&
      isPredictableStatus &&
      refundStatus.lastUpdated !== lastFetchedTimestamp.current
    ) {
      getPrediction(refundStatus);
      lastFetchedTimestamp.current = refundStatus.lastUpdated;
    } else if (refundStatus && !isPredictableStatus) {
      lastFetchedTimestamp.current = null;
    }
  }, [refundStatus, getPrediction, isPredictableStatus]);

  if (!refundStatus) {
    return null;
  }

  const statusStyles: Record<RefundStatusType, { bg: string; text: string }> = {
    ReturnReceived: {
      bg: 'bg-yellow-100 dark:bg-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-100'
    },
    ReturnProcessing: {
      bg: 'bg-blue-100 dark:bg-blue-800',
      text: 'text-blue-800 dark:text-blue-100'
    },
    NeedMoreInformation: {
      bg: 'bg-orange-100 dark:bg-orange-800',
      text: 'text-orange-800 dark:text-orange-100'
    },
    RefundApproved: {
      bg: 'bg-green-100 dark:bg-green-800',
      text: 'text-green-800 dark:text-green-100'
    },
    RefundSent: {
      bg: 'bg-teal-100 dark:bg-teal-800',
      text: 'text-teal-800 dark:text-teal-100'
    },
    RefundAdjusted: {
      bg: 'bg-purple-100 dark:bg-purple-800',
      text: 'text-purple-800 dark:text-purple-100'
    },
    RefundDelayed: {
      bg: 'bg-red-100 dark:bg-red-800',
      text: 'text-red-800 dark:text-red-100'
    },
    RefundDenied: {
      bg: 'bg-rose-100 dark:bg-rose-800',
      text: 'text-rose-800 dark:text-rose-100'
    }
  };

  const { bg, text } = statusStyles[refundStatus.status] || {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-100'
  };

  const refundStatusLabels: Record<RefundStatusType, string> = {
    ReturnReceived: 'Return Received',
    ReturnProcessing: 'Return Processing',
    NeedMoreInformation: 'Need More Information',
    RefundApproved: 'Refund Approved',
    RefundSent: 'Refund Sent',
    RefundAdjusted: 'Refund Adjusted',
    RefundDelayed: 'Refund Delayed',
    RefundDenied: 'Refund Denied'
  };

  return (
    <Card className={cn('w-full py-0')}>
      <CardHeader className={cn('p-6 gap-0 rounded-t-xl', bg)}>
        <CardTitle className={cn('flex flex-col items-center text-xl font-normal', text)}>
          <span>Refund Status:</span>
          <span className="text-3xl font-bold">{refundStatusLabels[refundStatus.status]}</span>
        </CardTitle>
      </CardHeader>
      {isPredictableStatus && (
        <CardContent className="space-y-2">
          {predicting && <PredictionInfoSkeleton />}
          {prediction && !predictError && <PredictionInfo prediction={prediction} />}
        </CardContent>
      )}
      <CardFooter className="flex justify-between py-2 border-t">
        <p className="text-sm text-muted-foreground">
          Last Updated:{' '}
          {refundStatus.lastUpdated
            ? formatDistanceToNowIntl(new Date(refundStatus.lastUpdated))
            : 'Unknown'}
        </p>
        <Button onClick={onRefresh} size="icon" variant="outline" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
