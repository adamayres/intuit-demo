import { useEffect, useRef, useState } from 'react';
import { getRefundStatus, type RefundStatusResponse } from '../api/refundService.ts';

export type UseRefundStatusResult = {
  /**
   * Current refund status.
   */
  status: RefundStatusResponse | null;
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
  refresh: () => void;
};

/**
 * Custom hook to manage refund status.
 *
 * @returns {UseRefundStatusResult} - The current refund status, loading state, error message, and a refresh function.
 */
export function useRefundStatus(): UseRefundStatusResult {
  const [status, setStatus] = useState<RefundStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  function getRefundStatusInternal() {
    setLoading(true);
    getRefundStatus()
      .then(setStatus)
      .catch(error => {
        setError(error?.message ?? 'Failed to load refund status');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    getRefundStatusInternal();
  }, []);

  return { status, loading, error, refresh: getRefundStatusInternal };
}
