import type { RefundStatusType } from '@/types/RefundStatusTypes.ts';

/**
 * Check if the refund status needs attention.
 *
 * @param status - The refund status to check.
 */
export function needsAttention(status: RefundStatusType): boolean {
  const needsAttentionStates: RefundStatusType[] = [
    'NeedMoreInformation',
    'RefundAdjusted',
    'RefundDelayed',
    'RefundSent',
    'RefundDenied'
  ];

  return needsAttentionStates.includes(status);
}
