import { useEffect, useState } from 'react';
import { getRefundStatus } from '../api/refundService.ts';
import type { RefundStatus } from '@/types/RefundStatusTypes.ts';

export type UseRefundStatusResult = {
  /**
   * Current refund status.
   */
  status: RefundStatus | null;
  /**
   * Loading state indicating if the refund status is being fetched.
   */
  loading: boolean;
  /**
   * Error message if fetching the refund status fails.
   */
  error: string | null;
  /**
   * Function to refresh the refund status.
   */
  refresh: (mockedResponse?: RefundStatus) => void;
};

/**
 * Custom hook to manage refund status.
 *
 * @returns {UseRefundStatusResult} - The current refund status, loading state, error message, and a refresh function.
 */
export function useRefundStatus(): UseRefundStatusResult {
  const [status, setStatus] = useState<RefundStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getRefundStatusInternal(mockedResponse?: RefundStatus) {
    setLoading(true);
    getRefundStatus(mockedResponse)
      .then(setStatus)
      .catch(error => {
        setError(error?.message ?? 'Failed to load refund status');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getRefundStatusInternal();
  }, []);

  return { status, loading, error, refresh: getRefundStatusInternal };
}
