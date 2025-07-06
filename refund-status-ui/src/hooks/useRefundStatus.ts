import { useEffect, useState } from 'react';
import { getRefundStatus, refreshRefundStatus } from '../api/refundService.ts';

import type { RefundStatus } from '@/types/RefundStatusTypes.ts';

export type UseRefundStatusResult = {
  status: RefundStatus | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useRefundStatus(): UseRefundStatusResult {
  const [status, setStatus] = useState<RefundStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial load
  useEffect(() => {
    setLoading(true);
    getRefundStatus()
      .then(data => {
        setStatus(data);
      })
      .catch(err => {
        setError(err?.message ?? 'Failed to load refund status');
      })
      .finally(() => setLoading(false));
  }, []);

  // Optional refresh trigger
  const refresh = () => {
    setLoading(true);
    refreshRefundStatus()
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err?.message ?? 'Failed to load refund status');
      })
      .finally(() => setLoading(false));
  };

  return { status, loading, error, refresh };
}
