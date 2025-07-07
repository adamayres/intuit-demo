import type { RefundStatus } from '@/types/RefundStatusTypes.ts';
import type { RefundPrediction } from '@/types/RefundPredictionTypes.ts';

export type RefundStatusResponse = { refundStatus: RefundStatus; prediction: RefundPrediction };

/**
 * Mock API service to fetch refund status data.
 */
export async function getRefundStatus(): Promise<RefundStatusResponse> {
  const response = await fetch('http://localhost:3000/refund-status', { credentials: 'include' });
  // TODO: Handle errors appropriately in production code
  return (await response.json()) as RefundStatusResponse;
}
