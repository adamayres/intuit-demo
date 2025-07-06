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
import { refundStatusLabels } from '@/constants/refundStatusLabels.ts';
import { defaultStatusStyle, refundStatusStyles } from '@/constants/refundStatusStyles.ts';

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

  const { bg, text } = refundStatusStyles[refundStatus.status] ?? defaultStatusStyle;

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
          {predicting && !prediction && <PredictionInfoSkeleton />}
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
