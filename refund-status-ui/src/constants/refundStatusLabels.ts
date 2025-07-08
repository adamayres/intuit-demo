import type { RefundStatusType } from '@/types/RefundStatusTypes.ts';

export const refundStatusLabels: Record<RefundStatusType, string> = {
  ReturnReceived: 'Return Received',
  ReturnProcessing: 'Return Processing',
  NeedMoreInformation: 'Need More Information',
  RefundApproved: 'Refund Accepted',
  RefundSent: 'Refund Sent',
  RefundAdjusted: 'Refund Adjusted',
  RefundDelayed: 'Refund Delayed',
  RefundDenied: 'Refund Denied'
};
