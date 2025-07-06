import { useRefundStatus } from '../hooks/useRefundStatus';
import { RefundStatusCard } from '../components/RefundStatusCard';
import { RefundStatusCardSkeleton } from '../components/RefundStatusCardSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

/**
 * Displays the current status of a refund.
 */
export function RefundStatusPage() {
  const { status, loading, error, refresh } = useRefundStatus();

  if ((loading && !status) || !status) {
    return (
      <div className="max-w-xl mx-auto mt-10 px-4">
        <RefundStatusCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-10">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      {status && (
        <RefundStatusCard
          refundStatus={status}
          onRefresh={() =>
            refresh({ status: 'RefundApproved', lastUpdated: new Date().toISOString() })
          }
          loading={loading}
        />
      )}
    </div>
  );
}
