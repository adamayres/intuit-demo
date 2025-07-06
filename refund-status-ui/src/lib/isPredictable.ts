import type { RefundStatusType } from '@/types/RefundStatusTypes.ts';

export function isPredictable(status: RefundStatusType): boolean {
  const predictableStates: RefundStatusType[] = [
    'ReturnReceived',
    'RefundAdjusted',
    'RefundApproved',
    'RefundSent'
  ];

  return predictableStates.includes(status);
}
