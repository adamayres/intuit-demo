import type { RefundStatusType } from '@/types/RefundStatusTypes.ts';

export const refundStatusDescriptions: Record<RefundStatusType, string> = {
  ReturnReceived: 'Your return was received and is waiting to be processed.',
  ReturnProcessing: 'Your return is currently being processed.',
  NeedMoreInformation: 'The IRS needs more information to process your return.',
  RefundApproved: 'Your refund has been accepted.',
  RefundSent: 'Your refund has been sent.',
  RefundAdjusted: 'Your refund amount was adjusted.',
  RefundDelayed: 'Your refund is delayed.',
  RefundDenied: 'Your refund was denied.'
};
