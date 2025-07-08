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
import { RefundProgress } from '@/components/RefundProgress.tsx';
import { refundStatusDescriptions } from '@/constants/refundStatusDescriptions.ts';
import { RefundStatusHelp } from '@/components/RefundStatusHelp.tsx';
import dayjs from 'dayjs';

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

  const now = dayjs();
  const lastChecked = dayjs(refundStatus.lastCheckedAt);
  const allowRefresh = now.diff(lastChecked, 'minute') >= 30;
  const useButton = false;

  const { bg, text, description } = refundStatusStyles[refundStatus.status] ?? defaultStatusStyle;

  return (
    <Card className={cn('w-full py-0')}>
      <CardHeader className={cn('p-6 gap-0 rounded-t-xl', bg)}>
        <CardTitle className={cn('flex flex-col items-center text-xl font-normal', text)}>
          <span className="text-3xl font-bold">{refundStatusLabels[refundStatus.status]}</span>
          <span className={cn('text-sm text-muted-foreground', description)}>
            {refundStatusDescriptions[refundStatus.status]}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <RefundProgress refundStatus={refundStatus.status} />

        {isPredictableStatus && refundPrediction && (
          <PredictionInfo prediction={refundPrediction} refundStatus={refundStatus} />
        )}

        <RefundStatusHelp refundStatus={refundStatus.status} />
      </CardContent>

      <CardFooter className="flex justify-between py-3 border-t">
        {refundStatus.lastCheckedAt && (
          <p className="text-sm text-muted-foreground">
            Last Updated: {formatDistanceToNowIntl(new Date(refundStatus.lastCheckedAt))}
          </p>
        )}
        {useButton && (
          <Button
            onClick={onRefresh}
            size="icon"
            variant="outline"
            disabled={!allowRefresh || loading}
            title={
              !allowRefresh
                ? 'You can refresh the status every 30 minutes'
                : loading
                  ? 'Refreshing...'
                  : 'Refresh Refund Status'
            }
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
