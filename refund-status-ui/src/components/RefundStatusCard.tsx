import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { RefundStatus, RefundStatusType } from '@/types/RefundStatusTypes';
import { formatDistanceToNowIntl } from '@/lib/dateUtils';
import { Button } from '@/components/ui/button.tsx';
import { Loader2, RotateCcw } from 'lucide-react';
import { PredictionInfo } from '@/components/PredictionInfo.tsx';
import { isPredictable } from '@/lib/isPredictable.ts';
import { refundStatusLabels } from '@/constants/refundStatusLabels.ts';
import { defaultStatusStyle, refundStatusStyles } from '@/constants/refundStatusStyles.ts';
import type { RefundPrediction } from '@/types/RefundPredictionTypes.ts';

export function RefundStatusCard({
  refundStatus,
  refundPrediction,
  loading,
  onRefresh
}: {
  refundStatus: RefundStatus | undefined;
  refundPrediction?: RefundPrediction | undefined;
  loading: boolean;
  onRefresh: () => void;
}) {
  const isPredictableStatus = isPredictable(refundStatus?.status as RefundStatusType);

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
          {refundPrediction && <PredictionInfo prediction={refundPrediction} />}
        </CardContent>
      )}
      <CardFooter className="flex justify-between py-2 border-t">
        {refundStatus.lastCheckedAt && (
          <p className="text-sm text-muted-foreground">
            Last Updated: {formatDistanceToNowIntl(new Date(refundStatus.lastCheckedAt))}
          </p>
        )}
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
