import type { RefundStatusType } from '@/types/RefundStatusTypes.ts';

/**
 * Check if the refund status is predictable.
 *
 * @param status - The refund status to check.
 */
export function isPredictable(status: RefundStatusType): boolean {
  const predictableStates: RefundStatusType[] = [
    'ReturnReceived',
    'RefundAdjusted',
    'RefundApproved',
    'RefundSent',
    'ReturnProcessing'
  ];

  return predictableStates.includes(status);
}
